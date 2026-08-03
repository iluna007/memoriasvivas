import { useOutletContext } from 'react-router-dom'
import WorksListView from '../components/works/WorksListView'
import { DOCUMENTALES_YOUTUBE } from '../data/documentalesYoutube'
import '../components/works/worksList.css'

export default function Documentales() {
  const { theme = 'dark' } = useOutletContext() ?? {}

  return <WorksListView theme={theme} items={DOCUMENTALES_YOUTUBE} />
}
