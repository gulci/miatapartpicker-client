import NextHead from 'next/head'

export interface HeadProps {
  description?: string
  title?: string
  type?: string
  url?: string
}

export function Head(props: HeadProps) {
  const description = props.description ? props.description : 'Pick parts. Build your Miata. Compare and share.'
  const title = props.title ? props.title : 'MiataPartPicker'
  const type = props.type ? props.type : 'website'

  return (
    <NextHead>
      {/* title */}
      <title>{title}</title>
      <meta property="og:title" content={title} key="og:title" />

      {/* url */}
      {props.url && (
        <>
          <link href={props.url} key="canonical" rel="canonical" />
          <meta property="og:url" content={props.url} key="og:url" />
        </>
      )}

      {/* description */}
      <meta name="description" key="description" content={description} />
      <meta content={description} key="og:description" property="og:description" />

      {/* og:type */}
      <meta property="og:type" content={type} key="og:type" />
    </NextHead>
  )
}
