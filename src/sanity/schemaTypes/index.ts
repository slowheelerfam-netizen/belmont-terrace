import { type SchemaTypeDefinition } from 'sanity'
import communityDocument from './document'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [communityDocument],
}
