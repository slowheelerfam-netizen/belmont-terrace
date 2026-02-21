import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Belmont Terrace')
    .items([
      S.documentTypeListItem('communityDocument').title('Community Documents'),
    ])
    
