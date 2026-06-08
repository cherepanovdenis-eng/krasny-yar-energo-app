#!/usr/bin/env python3
"""Local API/server for Красный Яр Энерго App."""

from __future__ import annotations

import html
import json
import posixpath
import re
import sys
from calendar import monthrange
from datetime import date, datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, quote, unquote, urljoin, urlparse
from urllib.request import Request, urlopen

import xlrd


PROJECTS_ROOT = Path(__file__).resolve().parents[1]
APP_PREFIX = "/krasny-yar-energo-app"
USER_AGENT = "Mozilla/5.0 (Krasny Yar Energo App; source-check)"
BROWSER_USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/125.0.0.0 Safari/537.36"
)
TIMEOUT_SECONDS = 32

MONTHS_RU = {
    "январ": 1,
    "феврал": 2,
    "март": 3,
    "апрел": 4,
    "май": 5,
    "мая": 5,
    "июн": 6,
    "июл": 7,
    "август": 8,
    "сентябр": 9,
    "октябр": 10,
    "ноябр": 11,
    "декабр": 12,
}

OFFICIAL_SOURCES = [
    {
        "region": "Тверская область",
        "gp": "АО \"Росатом Энергосбыт\"",
        "aliases": ["ао росатом энергосбыт", "ао атомэнергосбыт"],
        "site": "https://atomsbt.ru/tver/",
        "puncPage": "https://atomsbt.ru/raskrytie-informatsii/tver/predelnye-urovni-nereguliruemykh-tsen/",
        "trust": "official-page",
        "parser": "source-file-discovery",
    },
]


def clean_name(value: str) -> str:
    return re.sub(r"\s+", " ", str(value or "").replace("«", "").replace("»", "").replace('"', "")).strip().lower()


def find_source(region: str, gp: str) -> dict[str, Any] | None:
    region_clean = clean_name(region)
    gp_clean = clean_name(gp)
    for source in OFFICIAL_SOURCES:
        aliases = [clean_name(source["gp"]), *source["aliases"]]
        if clean_name(source["region"]) == region_clean and any(alias in gp_clean or gp_clean in alias for alias in aliases):
            return source
    return None


def safe_absolute_url(base: str, href: str) -> str:
    joined = urljoin(base, html.unescape(href or ""))
    parsed = urlparse(joined)
    path = quote(unquote(parsed.path), safe="/:%")
    query = quote(unquote(parsed.query), safe="=&?/:+%")
    return parsed._replace(path=path, query=query).geturl()


def fetch_text(url: str) -> tuple[str, dict[str, Any]]:
    last_error: Exception | None = None
    for attempt in range(1, 4):
        try:
            req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml"})
            with urlopen(req, timeout=TIMEOUT_SECONDS) as response:
                raw = response.read()
                content_type = response.headers.get("content-type", "")
                charset = "utf-8"
                match = re.search(r"charset=([\w-]+)", content_type, re.I)
                if match:
                    charset = match.group(1)
                return raw.decode(charset, "ignore"), {
                    "status": response.status,
                    "contentType": content_type,
                    "bytes": len(raw),
                    "attempt": attempt,
                }
        except Exception as exc:  # noqa: BLE001 - retries are surfaced after final attempt
            last_error = exc
    raise last_error or RuntimeError("source fetch failed")


def fetch_binary(url: str, referer: str) -> tuple[bytes, dict[str, Any]]:
    req = Request(
        url,
        headers={
            "User-Agent": BROWSER_USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/vnd.ms-excel,*/*;q=0.8",
            "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
            "Referer": referer,
        },
    )
    with urlopen(req, timeout=TIMEOUT_SECONDS) as response:
        raw = response.read()
        content_type = response.headers.get("content-type", "")
        if b"Web Application Firewall" in raw[:20000] or b"blocked" in raw[:20000].lower():
            raise RuntimeError("официальный сайт вернул страницу защиты WAF вместо файла")
        return raw, {
            "status": response.status,
            "contentType": content_type,
            "bytes": len(raw),
        }


def extract_anchor_links(page_url: str, text: str) -> list[dict[str, Any]]:
    links: list[dict[str, Any]] = []
    seen: set[str] = set()
    pattern = re.compile(r"<a\b[^>]*href=[\"']([^\"']+)[\"'][^>]*>(.*?)</a>", re.I | re.S)
    for match in pattern.finditer(text):
        href = html.unescape(match.group(1))
        label = re.sub(r"<[^>]+>", " ", match.group(2))
        label = " ".join(html.unescape(label).split())
        target = safe_absolute_url(page_url, href)
        if target in seen:
            continue
        seen.add(target)
        lower = f"{label} {unquote(target)}".lower()
        if not any(ext in lower for ext in [".xls", ".xlsx", ".xlsm", ".xlsb", ".zip", ".pdf"]):
            continue
        period = parse_period(label, target)
        if not period:
            continue
        links.append({
            "label": label or Path(unquote(urlparse(target).path)).name,
            "url": target,
            "period": period,
            "fileType": file_type(target),
        })
    links.sort(key=lambda row: row["period"], reverse=True)
    return links


def parse_period(label: str, url: str) -> str | None:
    source = f"{label} {unquote(url)}".lower()
    year_match = re.search(r"(20\d{2})", source)
    if not year_match:
        return None
    year = int(year_match.group(1))
    month = None
    for token, value in MONTHS_RU.items():
        if token in source:
            month = value
            break
    if not month:
        month_match = re.search(r"(?<!\d)(0?[1-9]|1[0-2])[._-](20\d{2})", source)
        if month_match:
            month = int(month_match.group(1))
            year = int(month_match.group(2))
    if not month:
        return None
    return f"{year}-{month:02d}"


def file_type(url: str) -> str:
    path = unquote(urlparse(url).path).lower()
    for ext in [".xlsx", ".xlsm", ".xlsb", ".xls", ".zip", ".pdf"]:
        if path.endswith(ext):
            return ext.lstrip(".")
    return "file"


def cell_text(value: Any) -> str:
    return " ".join(str(value or "").replace("\xa0", " ").split())


def row_text(sheet: Any, row_index: int) -> str:
    return " | ".join(cell_text(sheet.cell_value(row_index, col)) for col in range(sheet.ncols) if cell_text(sheet.cell_value(row_index, col)))


def as_number(value: Any) -> float | None:
    if isinstance(value, (int, float)):
        return float(value)
    text = cell_text(value).replace(" ", "").replace(",", ".")
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def find_row(sheet: Any, start: int, end: int, *needles: str) -> int | None:
    low_needles = [needle.lower() for needle in needles]
    for row_index in range(start, min(end, sheet.nrows)):
        text = row_text(sheet, row_index).lower()
        if all(needle in text for needle in low_needles):
            return row_index
    return None


def extract_hour_block(sheet: Any, start_row: int, period: str, voltage_code: str, base_by_key: dict[str, float] | None = None) -> list[dict[str, Any]]:
    year, month = [int(part) for part in period.split("-")]
    days_in_month = monthrange(year, month)[1]
    rows: list[dict[str, Any]] = []
    for row_index in range(start_row, min(start_row + 35, sheet.nrows)):
        day = as_number(sheet.cell_value(row_index, 0))
        if day is None:
            continue
        day_int = int(day)
        if day_int < 1 or day_int > days_in_month:
            continue
        iso = date(year, month, day_int).isoformat()
        for hour in range(24):
            value = as_number(sheet.cell_value(row_index, hour + 1))
            if value is None:
                continue
            key = f"{iso}:{hour}"
            svntsem = base_by_key.get(key, value) if base_by_key else value
            transmission = max(value - svntsem, 0)
            rows.append({
                "date": iso,
                "hour_start": hour,
                "voltage_code": voltage_code,
                "final_energy_rate_rub_mwh_no_vat": round(value, 6),
                "svntsem_rub_mwh_no_vat": round(svntsem, 6),
                "transmission_energy_rate_rub_mwh_no_vat": round(transmission, 6),
                "sales_markup_rub_mwh_no_vat": 0,
                "infrastructure_payments_rub_mwh_no_vat": 0,
            })
    return rows


def mean(values: list[float]) -> float:
    clean = [value for value in values if isinstance(value, (int, float))]
    return round(sum(clean) / len(clean), 6) if clean else 0


def parse_tver_rosatom_punc_xls(raw: bytes, period: str, source_url: str) -> dict[str, Any]:
    book = xlrd.open_workbook(file_contents=raw)
    sheet = book.sheet_by_name("от 670 кВт до 10 МВт")
    section_start = find_row(sheet, 0, sheet.nrows, "IV. Четвертая ценовая категория")
    section_end = find_row(sheet, section_start or 0, sheet.nrows, "V. Пятая ценовая категория") or sheet.nrows
    if section_start is None:
        raise RuntimeError("в файле не найден раздел 4 ЦК")

    base_header = find_row(sheet, section_start, section_end, "по договору купли-продажи")
    if base_header is None:
        raise RuntimeError("в разделе 4 ЦК не найден почасовой блок купли-продажи")
    base_rows = extract_hour_block(sheet, base_header + 2, period, "BASE")
    base_by_key = {f"{row['date']}:{row['hour_start']}": float(row["final_energy_rate_rub_mwh_no_vat"]) for row in base_rows}

    voltage_labels = {
        "ВН": "VN",
        "ГН": "GN",
        "СН1": "SN-I",
        "СН2": "SN-II",
        "НН": "NN",
    }
    energy_rows: list[dict[str, Any]] = []
    for label, code in voltage_labels.items():
        header = find_row(sheet, section_start, section_end, f"уровне напряжения {label}", "энергоснабжения")
        if header is None:
            continue
        energy_rows.extend(extract_hour_block(sheet, header + 2, period, code, base_by_key))

    purchased_row = find_row(sheet, section_start, section_end, "Ставка за мощность", "рублей/МВт")
    purchased_rate = 0.0
    if purchased_row is not None:
        numbers = [as_number(sheet.cell_value(purchased_row, col)) for col in range(sheet.ncols)]
        purchased_rate = next((value for value in numbers if value is not None), 0.0)

    network_header = find_row(sheet, section_start, section_end, "ГН", "ВН", "СН1", "СН2", "НН")
    network_row = find_row(sheet, network_header or section_start, section_end, "Ставка тарифа", "содержание электрических сетей") if network_header is not None else None
    network_by_voltage: dict[str, float] = {}
    if network_header is not None and network_row is not None:
        for col in range(sheet.ncols):
            label = cell_text(sheet.cell_value(network_header, col))
            code = voltage_labels.get(label)
            value = as_number(sheet.cell_value(network_row, col))
            if code and value is not None:
                network_by_voltage[code] = value

    capacity_rows = [
        {
            "voltage_code": code,
            "purchased_capacity_rate_rub_mw_month_no_vat": round(purchased_rate, 6),
            "network_maintenance_rate_rub_mw_month_no_vat": round(network_by_voltage.get(code, 0), 6),
            "source_url": source_url,
        }
        for code in voltage_labels.values()
        if code in network_by_voltage or code in {row["voltage_code"] for row in energy_rows}
    ]

    voltage_summary: dict[str, dict[str, float]] = {}
    for code in voltage_labels.values():
        voltage_rows = [row for row in energy_rows if row["voltage_code"] == code]
        if not voltage_rows:
            continue
        voltage_summary[code] = {
            "final_energy_avg_rub_mwh_no_vat": mean([row["final_energy_rate_rub_mwh_no_vat"] for row in voltage_rows]),
            "svntsem_avg_rub_mwh_no_vat": mean([row["svntsem_rub_mwh_no_vat"] for row in voltage_rows]),
            "transmission_avg_rub_mwh_no_vat": mean([row["transmission_energy_rate_rub_mwh_no_vat"] for row in voltage_rows]),
        }

    if not energy_rows:
        raise RuntimeError("в разделе 4 ЦК не найдены почасовые ставки по уровням напряжения")
    return {
        "status": "loaded",
        "parser": "rosatom-tver-4ck-v1",
        "categories": ["4"],
        "period": period,
        "energy": energy_rows,
        "capacity": capacity_rows,
        "summary": {
            "source_url": source_url,
            "source_file": Path(unquote(urlparse(source_url).path)).name,
            "voltage_summary": voltage_summary,
            "warning": "Разобрана 4 ЦК по шаблону Росатом/Тверь. 1-3, 5-6 ЦК пока отмечаются как найденный официальный файл.",
        },
    }


def try_import_punc_file(period_row: dict[str, Any], source: dict[str, Any]) -> dict[str, Any]:
    url = period_row.get("primaryUrl") or ""
    if not url or period_row.get("fileType") not in {"xls", "xlsx", "xlsm"}:
        return {"status": "skipped", "message": "для периода нет Excel-файла для разбора"}
    raw, fetch_meta = fetch_binary(url, source["puncPage"])
    parsed = parse_tver_rosatom_punc_xls(raw, period_row["period"], url)
    parsed["download"] = fetch_meta
    return parsed


def discover_punc(query: dict[str, list[str]]) -> dict[str, Any]:
    region = query.get("region", [""])[0]
    gp = query.get("gp", [""])[0]
    horizon = int(query.get("horizon", ["3"])[0] or "3")
    should_import = query.get("import", ["0"])[0] in {"1", "true", "yes"}
    source = find_source(region, gp)
    if not source:
        return {
            "status": "manual-required",
            "region": region,
            "gp": gp,
            "message": "Официальная страница ПУНЦ для ГП не закреплена в реестре источников.",
            "periods": [],
        }
    try:
        text, fetch_meta = fetch_text(source["puncPage"])
        links = extract_anchor_links(source["puncPage"], text)
        by_period: dict[str, list[dict[str, Any]]] = {}
        for link in links:
            by_period.setdefault(link["period"], []).append(link)
        periods = [
            {
                "period": period,
                "status": "source-found",
                "links": period_links,
                "primaryUrl": period_links[0]["url"],
                "fileType": period_links[0]["fileType"],
            }
            for period, period_links in sorted(by_period.items(), reverse=True)
        ][: max(1, horizon)]
        if should_import:
            for period_row in periods:
                try:
                    parsed = try_import_punc_file(period_row, source)
                    period_row["parsed"] = parsed
                    if parsed.get("status") == "loaded":
                        period_row["status"] = "partial-loaded"
                        period_row["loadedCategories"] = parsed.get("categories", [])
                except Exception as exc:  # noqa: BLE001 - one bad file must not block source discovery
                    period_row["parsed"] = {
                        "status": "error",
                        "message": str(exc),
                    }
        return {
            "status": "source-found" if periods else "source-empty",
            "region": source["region"],
            "gp": source["gp"],
            "site": source["site"],
            "puncPage": source["puncPage"],
            "trust": source["trust"],
            "parser": source["parser"],
            "checkedAt": datetime.now().isoformat(timespec="seconds"),
            "fetch": fetch_meta,
            "periods": periods,
            "message": "Официальная страница проверена." if periods else "Страница проверена, файлы ПУНЦ не найдены.",
        }
    except Exception as exc:  # noqa: BLE001 - API should explain source failures to UI
        return {
            "status": "source-error",
            "region": source["region"],
            "gp": source["gp"],
            "site": source["site"],
            "puncPage": source["puncPage"],
            "message": f"Не удалось проверить официальный источник: {exc}",
            "periods": [],
        }


class KyeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(PROJECTS_ROOT), **kwargs)

    def do_GET(self) -> None:  # noqa: N802 - stdlib handler API
        parsed = urlparse(self.path)
        if parsed.path in {f"{APP_PREFIX}/api/health", "/api/health"}:
            self.send_json({"status": "ok", "app": "krasny-yar-energo-app"})
            return
        if parsed.path in {f"{APP_PREFIX}/api/punc/discover", "/api/punc/discover"}:
            self.send_json(discover_punc(parse_qs(parsed.query)))
            return
        super().do_GET()

    def translate_path(self, path: str) -> str:
        parsed = urlparse(path)
        clean = posixpath.normpath(unquote(parsed.path))
        if clean == APP_PREFIX:
            clean = f"{APP_PREFIX}/"
        return super().translate_path(clean)

    def send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> int:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8797
    server = ThreadingHTTPServer(("127.0.0.1", port), KyeHandler)
    print(f"Красный Яр Энерго App: http://127.0.0.1:{port}/krasny-yar-energo-app/", flush=True)
    print(f"API: http://127.0.0.1:{port}/krasny-yar-energo-app/api/health", flush=True)
    server.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
