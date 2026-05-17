import { Catalog } from 'components/catalog/catalog';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const metadata = {
  title: 'Catalog',
  description: 'Browse the full catalog of German Werks pieces.',
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = (searchParams ?? {}) as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });

  return (
    <Catalog products={products} activeCollectionHandle={null} activeCollectionTitle={null} />
  );
}
