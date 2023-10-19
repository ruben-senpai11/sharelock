import {json} from "@remix-run/node"
import{
    Button,
    Page,
    LegacyCard,
    ResourceList,
    ResourceItem,
    Avatar,
    Text,
    TextField,
    Filters,
    Tabs,
    Pagination,
    Box,
    Link,
    HorizontalStack
} from "@shopify/polaris";

import type {ResourceListProps} from '@shopify/polaris';
import {useState, useCallback} from 'react';


export default function Index() {
  
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'all-customers-1',
      content: 'Tout',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'accepts-marketing-1',
      content: 'Actifs',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'repeat-customers-1',
      content: 'Provisoires',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: 'prospects-1',
      content: 'Archivés',
      panelID: 'prospects-content-1',
    },
  ];

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps['selectedItems']
  >([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [taggedWith, setTaggedWith] = useState<string | undefined>('');
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);

  const handleTaggedWithChange = useCallback(
    (value: string) => setTaggedWith(value),
    [],
  );
  const handleQueryValueChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );
  const handleTaggedWithRemove = useCallback(
    () => setTaggedWith(undefined),
    [],
  );
  const handleQueryValueRemove = useCallback(
    () => setQueryValue(undefined),
    [],
  );
  const handleClearAll = useCallback(() => {
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [handleQueryValueRemove, handleTaggedWithRemove]);

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };

  const items = [
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
    {
      id: '112',
      url: '#',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: '212',
      url: '#',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
  ];

  const promotedBulkActions = [
    {
      content: 'Edit customers',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];

  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: 'Delete customers',
      onAction: () => console.log('Todo: implement bulk delete'),
    },
  ];

  const filters = [
    {
      key: 'taggedWith3',
      label: 'Trier par',
      filter: (
        <TextField
          label="Trier par"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters =
    taggedWith && !isEmpty(taggedWith)
      ? [
          {
            key: 'taggedWith3',
            label: disambiguateLabel('taggedWith3', taggedWith),
            onRemove: handleTaggedWithRemove,
          },
        ]
      : [];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={filters}
      appliedFilters={appliedFilters}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
    </Filters>
  );

  return (
    <Page fullWidth>
        <Text as="h2" variant="headingLg">Administration</Text>
        <Box paddingBlockStart="0" paddingBlockEnd="8"> 
          <Text as="p" variant="bodyMd">Gérez les assurances de vos produits</Text>
        </Box>




      <LegacyCard>  
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <ResourceList
            resourceName={resourceName}
            items={items}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            promotedBulkActions={promotedBulkActions}
            bulkActions={bulkActions}
            sortValue={sortValue}
            sortOptions={[
              {label: 'Plus récent', value: 'DATE_MODIFIED_DESC'},
              {label: 'Plus ancien', value: 'DATE_MODIFIED_ASC'},
            ]}
            onSortChange={(selected) => {
              setSortValue(selected);
              console.log(`Sort option changed to ${selected}.`);
            }}
            filterControl={filterControl}
          />
        </Tabs>
      </LegacyCard>
      <Box padding="4">
        <HorizontalStack align="center">
          <Text as="span">Afficher les </Text>{" "}
          <Link url="/app/stats">statistiques</Link>
        </HorizontalStack>
      </Box>
    </Page>
  );

  function renderItem(item: typeof items[number]) {
    const {id, url, name, location, latestOrderUrl} = item;
    const media = <Avatar customer size="medium" name={name} />;
    const shortcutActions = latestOrderUrl
      ? [{content: 'View latest order', url: latestOrderUrl}]
      : undefined;
    return (
      <ResourceItem
        id={id}
        url={url}
        media={media}
        accessibilityLabel={`View details for ${name}`}
        shortcutActions={shortcutActions}
        persistActions
      >
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {name}
        </Text>
        <div>{location}</div>
      </ResourceItem>
    );
  }

  function disambiguateLabel(key: string, value: string): string {
    switch (key) {
      case 'taggedWith3':
        return `Tagged with ${value}`;
      default:
        return value;
    }
  }

  function isEmpty(value: string): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}