import { useTranslation } from 'react-i18next'
import { documentalLocalizado } from '../../data/localizado'

/**
 * Cartelera de cine: 3 posteres, uno por documental, con espacio negro
 * entre ellos. Hover -> zoom sutil de la imagen (sin reproducir video).
 * Click -> abre el video en YouTube (pestaña nueva).
 */
export default function DocumentalesCartelera({ items }) {
  const { t, i18n } = useTranslation()
  return (
    <section className="documentales-cartelera">
      {items.map((original) => {
        const item = documentalLocalizado(original, i18n.language)
        return (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="documentales-cartelera__panel"
          aria-label={`${item.title} - ${item.subtitle}. ${t('comun.verYoutube')}.`}
        >
          <div className="documentales-cartelera__media">
            <img
              src={item.poster}
              alt={`${item.title} - ${item.subtitle}`}
              className="documentales-cartelera__poster"
              loading="lazy"
            />
          </div>
        </a>
        )
      })}
    </section>
  )
}
