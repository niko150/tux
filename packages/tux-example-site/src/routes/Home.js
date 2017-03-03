import React from 'react'
import { Editable, connect } from 'tux'
import { H1, H2 } from '../components/typography'
import Banner from '../components/Banner'
import Menu from '../components/Menu'
import Section from '../components/Section'
import SellPoints from '../components/SellPoints'
import Carousel from '../components/Carousel'
import Testimonial from '../components/Testimonial'
import Gallery from '../components/Gallery'
import SocialPlug from '../components/SocialPlug'
import Pricetable from '../components/Pricetable'

const Home = ({ pages, articles, sellPoints, pricetable, testimonial, gallery, carousel }) => {

  if (!pages) return null
  const page = pages.items[0]

  return (
    <div className="p-Home">
      <Menu />
      <Banner color="#473bb1">
        <Editable model={page} field="fields.content.title" />
      </Banner>
      <Section>
        <H1><Editable model={page} field="fields.content.tagline" /></H1>
        <SellPoints sellPoints={sellPoints.items} />
      </Section>
      <Section>
        <Carousel carouselItems={carousel.items}/>
      </Section>
      <Section>
        <Testimonial testimonial={testimonial.items}/>
      </Section>
      <Section>
        <H1>Who is using Tux</H1>
        <Gallery galleryItems={gallery.items} />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
      </Section>
      <Section>
        <H1>Get our Product for the Best Price</H1>
        <H2>Contact us for Enterprise plans</H2>
        <Pricetable pricetableItems={pricetable.items} />
      </Section>
    </div>
  )
}

export default connect(async contentful => ({
  pages: await contentful.getEntries({ content_type: 'page' }),
  articles: await contentful.getEntries({ content_type: 'article', order: '-sys.createdAt' }),
  sellPoints: await contentful.getEntries({ content_type: 'sellPoint' }),
  pricetable: await contentful.getEntries({ content_type: 'priceTable', order: 'sys.createdAt' }),
  testimonial: await contentful.getEntries({ content_type: 'testimony' }),
  gallery: await contentful.getEntries({ content_type: 'gallery' }),
  carousel: await contentful.getEntries({ content_type: 'carousel' }),
}))(Home)