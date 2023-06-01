import NextHead from 'next/head'

export interface HeadProps {
  description?: string
  title?: string
  type?: string
  url?: string
}

export default function Head(props: HeadProps) {
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

      {/* favicons */}
      {/* <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60z60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/icons/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" /> */}
    </NextHead>
  )
}
