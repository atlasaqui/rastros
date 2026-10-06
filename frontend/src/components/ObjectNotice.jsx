import ObjectInspection from './ObjectInspection';
export default function ObjectNotice({notice,variant,onClose}) {
 return <ObjectInspection imageId={notice.imageId} title={notice.title} text={notice.body} variant={variant} onNext={onClose} onClose={onClose} nextLabel={notice.next==="piano"?"Tocar piano":"Voltar ao vagão"}/>;
}
