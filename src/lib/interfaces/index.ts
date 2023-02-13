import type { FooterQuery, NavbarQuery, PageQuery } from '@/graphql/contentful';

export interface Product {
  desc: string;
  image: string;
  price: string | number;
  title: string;
}

export interface Category {
  heading: string | undefined;
  title: string;
  color: string | undefined;
  caption: string;
  categoriesArr: { image: string }[];
}

export type Maybe<T> = T | null;

export type SectionsCollectionFromQuery = NonNullable<
  NonNullable<PageQuery['pageCollection']>['items'][0]
>['sectionsCollection'];

export type SelectionCollectionItems = NonNullable<
  NonNullable<
    NonNullable<PageQuery['pageCollection']>['items'][0]
  >['sectionsCollection']
>['items'];

export type PageContentFromQuery = NonNullable<
  NonNullable<PageQuery['pageCollection']>['items'][0]
>;

type NonNullableSectionItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<PageQuery['pageCollection']>['items'][0]
    >['sectionsCollection']
  >['items'][0]
>;

export type Section<T extends NonNullableSectionItem['__typename']> = Extract<
  NonNullableSectionItem,
  { __typename: T }
>;

export type FooterContentFromQuery = NonNullable<
  NonNullable<NonNullable<FooterQuery['footerCollection']>['items'][0]>
>;

export type NavbarContentFromQuery = NonNullable<
  NonNullable<NonNullable<NavbarQuery['navbarCollection']>['items'][0]>
>;
