import { type SchemaTypeDefinition } from 'sanity'
import communityDocument from './document'
import siteUpdate from './siteUpdate'
import sitePage from './sitePage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [communityDocument, siteUpdate, sitePage],
}
