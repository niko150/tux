import React from 'react'
import { Editable, connect } from 'tux'
import { H1, H2 } from '../components/typography'
import ProductBanner from '../components/ProductBanner'
import Menu from '../components/Menu'
import Section from '../components/Section'
import SellPoints from '../components/SellPoints'
import SocialPlug from '../components/SocialPlug'
import Carousel from '../components/Carousel'
import Testimonial from '../components/Testimonial'
import TwitterFeed from '../components/TwitterFeed'
import Newsletter from '../components/Newsletter'
import Pricetable from '../components/Pricetable'

import ProductBannerImage from '../ProductBannerImage.png'

const Home = ({ pages, articles, sellPoints, pricetable, testimonial, gallery, carousel }) => {

  if (!pages) return null
  const page = pages.items[0]

  return (
    <div className="p-Home">
      <Menu />
      <ProductBanner image={ProductBannerImage}>
        <div className="ProductBanner-heading"><Editable model={page} field="fields.content.title" /></div>
        <div className="ProductBanner-text"><Editable model={page} field="fields.content.subtitle" /></div>
      </ProductBanner>
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
      <Section backgroundColor="#F5F7FA">
        <H1>What People Say About Tux</H1>
        <H2>Totally random and unbiased selection of people</H2>
        <TwitterFeed />
        <SocialPlug>
          Are you using Tux? <strong>Let us know on Twitter</strong>
        </SocialPlug>
      </Section>
      <Section>
        <H1>Sign up for our newsletter, you won't regret it *</H1>
        <H2>* Unless you don't like cat facts.</H2>
        <Newsletter></Newsletter>
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
