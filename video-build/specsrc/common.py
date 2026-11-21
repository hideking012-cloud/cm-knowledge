import json
import os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','specs')+os.sep
def arrowdown(x,y,d='0.1',l=36): return f"<g data-in='{d}'><path d='M{x} {y} V{y+l-12}' stroke='#f5b942' stroke-width='5'/><path d='M{x-10} {y+l-16} L{x+10} {y+l-16} L{x} {y+l} z' fill='#f5b942'/></g>"
def arrowright(x,y,d='0.1',l=40): return f"<g data-in='{d}'><path d='M{x} {y} H{x+l-14}' stroke='#f5b942' stroke-width='5'/><path d='M{x+l-18} {y-10} L{x+l-18} {y+10} L{x+l} {y} z' fill='#f5b942'/></g>"
def box(x,y,w,h,label,d,fs=22,stroke='#6f86bb',fill='#13285e',color='#eef3ff',sub=None,subc='#a9b9de'):
    t=f"<g data-in='{d}'><rect x='{x}' y='{y}' width='{w}' height='{h}' rx='12' fill='{fill}' stroke='{stroke}' stroke-width='3'/><text x='{x+w/2}' y='{y+h/2+(fs*0.35 if not sub else -4)}' fill='{color}' font-size='{fs}' font-weight='700' text-anchor='middle'>{label}</text>"
    if sub: t+=f"<text x='{x+w/2}' y='{y+h/2+24}' fill='{subc}' font-size='17' text-anchor='middle'>{sub}</text>"
    return t+"</g>"
def okbox(x,y,w,h,label,d,fs=22): return box(x,y,w,h,label,d,fs=fs,stroke='#5ad17b',fill='#0c2d33',color='#5ad17b')
def txt(x,y,s,d=None,c='#eef3ff',fs=20,a='start',w=700):
    return f"<text {'data-in='+chr(39)+d+chr(39) if d else ''} x='{x}' y='{y}' fill='{c}' font-size='{fs}' font-weight='{w}' text-anchor='{a}'>{s}</text>"
person=lambda x,y,c='#eef3ff':f"<g fill='{c}'><circle cx='{x}' cy='{y}' r='9'/><rect x='{x-8}' y='{y+12}' width='16' height='30' rx='6'/></g>"
def camera(x,y,d): return f"<g data-in='{d}' transform='translate({x} {y})'><rect x='0' y='12' width='110' height='74' rx='12' fill='#13285e' stroke='#eef3ff' stroke-width='4'/><rect x='34' y='0' width='42' height='16' rx='4' fill='#eef3ff'/><circle cx='55' cy='49' r='22' fill='none' stroke='#eef3ff' stroke-width='5'/><circle cx='55' cy='49' r='8' fill='#f5b942'/></g>"
def doc(x,y,w,h,title,d,lines=4,fs=22):
    t=f"<g data-in='{d}'><rect x='{x}' y='{y}' width='{w}' height='{h}' rx='10' fill='#13285e' stroke='#6f86bb' stroke-width='3'/><text x='{x+w/2}' y='{y+38}' fill='#eef3ff' font-size='{fs}' font-weight='700' text-anchor='middle'>{title}</text>"
    for i in range(lines): t+=f"<line x1='{x+18}' y1='{y+62+i*26}' x2='{x+w-18-(30 if i==lines-1 else 0)}' y2='{y+62+i*26}' stroke='#6f86bb' stroke-width='3'/>"
    return t+"</g>"
def stop(x,y,d,label='停止'):
    import math
    pts=' '.join(f"{x+46*math.cos(math.radians(22.5+45*i)):.1f},{y+46*math.sin(math.radians(22.5+45*i)):.1f}" for i in range(8))
    return f"<g data-in='{d}'><polygon points='{pts}' fill='#d64545' stroke='#fff' stroke-width='4'/><text x='{x}' y='{y+9}' fill='#fff' font-size='26' font-weight='900' text-anchor='middle'>{label}</text></g>"
def svg(*parts): return "<svg viewBox='0 0 540 440'>"+''.join(parts)+"</svg>"
def save(slug,d): json.dump(d,open(OUT+slug+'.json','w',encoding='utf8'),ensure_ascii=False,indent=2)
