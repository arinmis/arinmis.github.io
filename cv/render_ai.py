from pathlib import Path
from html import escape
import re
import argparse

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

parser = argparse.ArgumentParser(description='Render the English or Turkish AI CV from its LaTeX content.')
parser.add_argument('--language', choices=['en', 'tr'], default='en')
args = parser.parse_args()
turkish = args.language == 'tr'
ROOT = Path(__file__).resolve().parents[1]
stem = 'Mustafa_Arinmis_AI_TR' if turkish else 'Mustafa_Arinmis_AI'
SOURCE = ROOT / f'cv/clean/{stem}.tex'
OUTPUT = ROOT / f'output/pdf/{stem}.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
for name, index in [('Charter', 0), ('CharterItalic', 1), ('CharterBoldItalic', 2), ('CharterBold', 3)]:
    pdfmetrics.registerFont(TTFont(name, '/System/Library/Fonts/Supplemental/Charter.ttc', subfontIndex=index))
pdfmetrics.registerFontFamily('Charter', normal='Charter', bold='CharterBold', italic='CharterItalic', boldItalic='CharterBoldItalic')

def groups(text):
    result, depth, start = [], 0, 0
    for i, c in enumerate(text):
        if c == '{':
            if depth == 0:
                start = i + 1
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                result.append(text[start:i])
    return result

def rich(text):
    out = ''
    while text:
        match = re.search(r'\\(textbf|href)\{', text)
        if not match:
            out += escape(text.replace(r'\#', '#').replace(r'\&', '&').replace(r'\_', '_').replace('--', '-'))
            break
        out += rich(text[:match.start()])
        tail = text[match.start():]
        args = groups(tail)
        count = 2 if match.group(1) == 'href' else 1
        depth, seen, end = 0, 0, 0
        for i, c in enumerate(tail):
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    seen += 1
                    if seen == count:
                        end = i + 1
                        break
        if count == 2:
            out += f'<link href="{escape(args[0], quote=True)}">{rich(args[1])}</link>'
        else:
            out += '<b>' + rich(args[0]) + '</b>'
        text = tail[end:]
    return out

accent = colors.HexColor('#1A2733')
subtle = colors.HexColor('#666666')
body = ParagraphStyle('Body', fontName='Charter', fontSize=10.8, leading=12.3, textColor=colors.black)
bullet = ParagraphStyle('Bullet', parent=body, leftIndent=11, firstLineIndent=0, bulletIndent=1, spaceAfter=1)
section = ParagraphStyle('Section', parent=body, fontName='CharterBold', fontSize=12.5, leading=15, textColor=accent, spaceBefore=6, keepWithNext=True)
title = ParagraphStyle('Title', parent=body, fontName='CharterBold', fontSize=24, leading=28, alignment=TA_CENTER, textColor=accent)
contact = ParagraphStyle('Contact', parent=body, fontSize=9.5, leading=12, alignment=TA_CENTER, textColor=subtle)
role = ParagraphStyle('Role', parent=body, fontName='CharterItalic', textColor=subtle, spaceAfter=2, keepWithNext=True)
heading = ParagraphStyle('Heading', parent=body, fontName='CharterBold', keepWithNext=True)
date = ParagraphStyle('Date', parent=body, fontSize=9.5, alignment=TA_RIGHT)

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, leftMargin=24, rightMargin=24, topMargin=18, bottomMargin=18,
                        title='Mustafa Arinmis | ' + ('Yapay Zeka Mühendisi' if turkish else 'AI Engineer'), author='Mustafa Arinmis')
story = [Paragraph('Mustafa Arinmis', title), Spacer(1, 3),
         Paragraph('mustafa_arinmis@outlook.com &#8226; +90 543 549 99 53 &#8226; <link href="https://github.com/arinmis">github.com/arinmis</link> &#8226; <link href="https://www.linkedin.com/in/arinmis">linkedin.com/in/arinmis</link>', contact),
         Paragraph('Antalya, Türkiye &#183; Bilgisayar Mühendisliği, Akdeniz Üniversitesi' if turkish else 'Antalya, Turkiye &#183; BSc Computer Engineering, Akdeniz University', contact), Spacer(1, 3)]

first_section = r'\section{Özet}' if turkish else r'\section{Summary}'
content = SOURCE.read_text().split(first_section, 1)[1]
for line in (first_section + content).splitlines():
    line = line.strip()
    if not line or line.startswith('%') or line.startswith((r'\begin', r'\end')):
        continue
    if line.startswith(r'\section'):
        story.extend([Paragraph(rich(groups(line)[0]), section), HRFlowable(width='100%', thickness=.4, color=subtle, spaceAfter=3)])
    elif line.startswith((r'\resumeSubheading', r'\resumeProject')):
        args = groups(line)
        is_role = line.startswith(r'\resumeSubheading')
        when = args[3] if is_role else args[2]
        if not is_role and not when:
            story.extend([Spacer(1, 3), Paragraph('<b>' + rich(args[0]) + '</b> &#160; <i><font color="#666666">' + rich(args[1]) + '</font></i>', heading)])
            continue
        date_width = 150 if turkish else 112
        table = Table([[Paragraph(rich(args[0]), heading), Paragraph(rich(when), date)]], colWidths=[doc.width-date_width-12,date_width], hAlign='LEFT')
        table.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0),('VALIGN',(0,0),(-1,-1),'TOP')]))
        table.keepWithNext = True
        story.extend([Spacer(1,3), table, Paragraph(rich(args[2]) + ' &#183; ' + rich(args[1]) if is_role else rich(args[1]), role)])
    elif line.startswith(r'\item '):
        story.append(Paragraph(rich(line[len(r'\item '):]), bullet, bulletText='\u2022'))
    else:
        story.append(Paragraph(rich(line.removesuffix('\\\\')), body))
doc.build(story)
print(OUTPUT)
