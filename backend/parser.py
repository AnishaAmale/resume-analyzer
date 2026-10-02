"""
Resume text parser supporting PDF, DOCX, and TXT files with text normalization.
"""
import io
import re
from typing import Optional

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    import docx
except ImportError:
    docx = None


def normalize_text(text: str) -> str:
    """Normalize extracted resume text for uniform NLP analysis."""
    if not text:
        return ""
    
    # Replace non-breaking spaces and special unicode spaces
    text = text.replace("\u00a0", " ").replace("\u200b", "")
    
    # Standardize common bullet characters to bullet symbol and single space
    bullet_patterns = r"[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25C6\u25C8\u25A0\u25A1\u27A4\u27A2\u279C\u2705]\s*"
    text = re.sub(bullet_patterns, "\n\u2022 ", text)
    
    # Normalize Windows CRLF to standard LF
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    
    # Remove multiple successive blank lines (keep max 2)
    text = re.sub(r"\n{3,}", "\n\n", text)
    
    # Trim leading/trailing whitespace per line
    lines = [line.strip() for line in text.split("\n")]
    return "\n".join(lines).strip()


def parse_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file bytes."""
    if not PyPDF2:
        raise RuntimeError("PyPDF2 is not installed.")
    
    text_parts = []
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
            
    return normalize_text("\n".join(text_parts))


def parse_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX file bytes."""
    if not docx:
        raise RuntimeError("python-docx is not installed.")
    
    doc = docx.Document(io.BytesIO(file_bytes))
    text_parts = []
    
    for para in doc.paragraphs:
        if para.text.strip():
            # Check if paragraph has bullet styling
            if para.style and "List" in para.style.name:
                text_parts.append(f"\u2022 {para.text.strip()}")
            else:
                text_parts.append(para.text.strip())
                
    for table in doc.tables:
        for row in table.rows:
            row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_text:
                text_parts.append(" | ".join(row_text))
                
    return normalize_text("\n".join(text_parts))


def parse_txt(file_bytes: bytes) -> str:
    """Extract text from TXT/MD file bytes trying common encodings."""
    encodings = ["utf-8", "latin-1", "cp1252", "ascii"]
    for enc in encodings:
        try:
            return normalize_text(file_bytes.decode(enc))
        except UnicodeDecodeError:
            continue
    return normalize_text(file_bytes.decode("utf-8", errors="ignore"))


def parse_file(file_bytes: bytes, filename: str) -> str:
    """
    Dispatch parser based on file extension.
    Supported: .pdf, .docx, .doc, .txt, .md
    """
    ext = filename.lower().rsplit(".", 1)[-1] if "." in filename else ""
    
    if ext == "pdf":
        return parse_pdf(file_bytes)
    elif ext in ["docx", "doc"]:
        return parse_docx(file_bytes)
    elif ext in ["txt", "md"]:
        return parse_txt(file_bytes)
    else:
        # Fallback to text parsing
        return parse_txt(file_bytes)
