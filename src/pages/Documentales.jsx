import DocumentalesCartelera from '../components/documentales/DocumentalesCartelera'
import { DOCUMENTALES_DESTACADOS } from '../data/documentalesDestacados'
import '../components/documentales/documentalesCartelera.css'

export default function Documentales() {
  return <DocumentalesCartelera items={DOCUMENTALES_DESTACADOS} />
}
