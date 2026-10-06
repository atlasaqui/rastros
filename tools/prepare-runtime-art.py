"""Generate runtime derivatives; original art stays untouched in frontend/public/media.
Requires Pillow. Run from any directory. Coordinates remain in original SVG space.
"""
from pathlib import Path
import json,re
from PIL import Image
root=Path(__file__).resolve().parents[1]
media=root/'frontend/public/media'
source=(root/'frontend/src/data/mediaAssets.js').read_text(encoding='utf-8')
assets=json.loads(source[source.index('{'):source.rindex('}')+1])
for key in assets:
 original=media/key
 if not original.is_file():continue
 with Image.open(original) as im:
  im.thumbnail((1920,1920),Image.Resampling.LANCZOS)
  target=media/'optimized'/key;target.parent.mkdir(parents=True,exist_ok=True)
  im.save(target,**({'quality':93} if target.suffix.lower() in ['.jpg','.jpeg'] else {}))
assets={key:'media/optimized/'+key for key in assets}
(root/'frontend/src/data/mediaAssets.js').write_text('export const MEDIA = '+json.dumps(assets,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
regions_text=(root/'frontend/src/data/pianoRegions.js').read_text(encoding='utf-8')
regions=json.loads(regions_text[regions_text.index('{'):regions_text.rindex('}')+1])
words=['um','dois','três','quatro','cinco','seis','sete','oito']
for key,box in regions.items():
 n=int(key[1:]);name='tecla '+('apertada '+words[8-n] if key[0]=='A' else 'pressionada '+words[7-n])+'.png'
 with Image.open(media/'piano'/name) as im:
  target=media/'runtime-piano'/(key+'.png');target.parent.mkdir(exist_ok=True);im.crop(box).save(target)
bounds_text=(root/'frontend/src/data/mediaBounds.js').read_text(encoding='utf-8')
bounds=json.loads(bounds_text[bounds_text.index('{'):bounds_text.rindex('}')+1])
for mode in ['cursor','pegar']:
 for color in ['preto','branco','vermelho']:
  key='cursor/'+mode+' '+color+'.png'
  with Image.open(media/key) as im:
   cropped=im.crop(bounds[key]);cropped.thumbnail((30,30),Image.Resampling.LANCZOS)
   canvas=Image.new('RGBA',(32,32));canvas.paste(cropped,(1,1))
   target=media/'runtime-cursors'/(mode+'-'+color+'.png');target.parent.mkdir(exist_ok=True);canvas.save(target)
print('Runtime art generated; original artwork retained.')
