import{
  Page,
  Button,
  Thumbnail,
  Box,
  Card,
  Badge,
  ChoiceList,
  IndexFilters,
  IndexTable,
  useSetIndexFiltersMode,
  useIndexResourceState
}from "@shopify/polaris";

import { useState, useCallback }  from 'react';

import { ImageMajor } from "@shopify/polaris-icons";

import shopify from "../shopify.server";
import {useLoaderData, useFetcher} from '@remix-run/react';

import prisma from "~/db.server";

// import 'tests.js'


export async function loader({ request }) {
  
  const { admin } = await shopify.authenticate.admin(request);
  const response = await admin.graphql(`
    {
      products(first: 250) {
        nodes {
          id
          title
          featuredImage{
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          totalInventory
          status
          productType
          vendor
        }
      }
      
    }`);

  const { data: { products },  } = await response.json();

  const get_insured_products = await prisma.insuredProducts.findMany()

  // Insert the insured products ids into a fileContent for they'll be read by liquid to filter products that deserve insurance
  const fs = require("fs");

  const insured_ids = []
  for (const insured_product of get_insured_products) {
    const product_id = insured_product.product_id    
    const idPattern = /\d+$/; 
    const match = product_id.match(idPattern);    
    if (match) {
      const extractedId = match[0];
      insured_ids.push(extractedId)
    }   
  }

  const declaration = "let fileContent ="
  const content = JSON.stringify(insured_ids)
  const fileContent = declaration + content
  
  // console.log('After : \n'+insured_ids)
  fs.writeFileSync("extensions/sharelock-test-01/assets/tests.js", fileContent)

  // return products list and insured_products form prisma db list for table listing
  return { products : products, insured_products : get_insured_products};

} 

export async function action ({ request }){
  const field = await request.formData();
  const selected_products = JSON.parse(field.get('data')); 
  const { admin } = await shopify.authenticate.admin(request);

  if(field.get('action')=='add_insurance'){
    for (const product of selected_products) {
      try {    
        const insert = await prisma.insuredProducts.create({
          data : { product_id : product },
        })
        // console.log(selected_products)
        console.log(product);
        const meta_fields_request = await admin.graphql (`
        {
          mutation AddInsurance {
            productUpdate(
              input: {id: "gid://shopify/Product/8290594980137", 
                metafields: [
                  {
                    namespace: "judgeme", 
                    key: "badge",
                    value: "true", 
                    type: "string"
                    }
                ]
              }
            ) {
              product {
                metafields(first: 100) {
                  edges {
                    node {
                      namespace
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        }  
      `)
  
      const meta_fields_to_true = await meta_fields_request.json();
      } catch (error) {
        console.error(error); 
      }
    }
  }else if(field.get('action')=='revoke_insurance'){
    
    for (const product of selected_products) {
      try {    
        const revoke = await prisma.insuredProducts.delete({
          where : { product_id : product }
        })

        const meta_fields_request = await admin.graphql (`
        {
          mutation RevokeInsurance {
          productUpdate(
          input : {
            id: "gid://shopify/Product/{ product }",
            metafields: [
              {
                namespace: "sharelock insurance",
                key: "status",
                value: "false",
                type: "boolean",
              }
            ]
            }) 
          }
        }  
      `)
  
      const meta_fields_to_false = await meta_fields_request.json();
      } catch (error) {
        
      }
    }
  }
  return null
}


export default function () {
  function disambiguateLabel(key, value) {
    switch (key) {
      case "type":
        return value.map((val) => `type: ${val}`).join(", ");
      case "status":
        return value.map((val) => `status: ${val}`).join(", ");
      default:
        return value;
    }
  }
  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [itemStrings, setItemStrings] = useState([
    "Tout",
    "Assurés",
    "Non assurés",
    "Archivés",
  ]);
  const deleteView = (index) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };
  const duplicateView = async (name) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };
  const tabs = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value) => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (name) => {
                await sleep(1);
                duplicateView(name);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions = [
    { label: "Product", value: "product asc", directionLabel: "Ascending" },
    { label: "Product", value: "product desc", directionLabel: "Descending" },
    { label: "Status", value: "status asc", directionLabel: "A-Z" },
    { label: "Status", value: "status desc", directionLabel: "Z-A" },
    { label: "Type", value: "type asc", directionLabel: "A-Z" },
    { label: "Type", value: "type desc", directionLabel: "Z-A" },
    { label: "Vendor", value: "vendor asc", directionLabel: "Ascending" },
    { label: "Vendor", value: "vendor desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["product asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};
  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };
  const primaryAction =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [status, setStatus] = useState(undefined);
  const [type, setType] = useState(undefined);
  const [queryValue, setQueryValue] = useState("");
  const handleStatusChange = useCallback((value) => setStatus(value), []);
  const handleTypeChange = useCallback((value) => setType(value), []);
  const handleFiltersQueryChange = useCallback(
    (value) => setQueryValue(value),
    []
  );
  const handleStatusRemove = useCallback(() => setStatus(undefined), []);
  const handleTypeRemove = useCallback(() => setType(undefined), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleStatusRemove();
    handleTypeRemove();
    handleQueryValueRemove();
  }, [handleStatusRemove, handleQueryValueRemove, handleTypeRemove]);
  const filters = [
    {
      key: "status",
      label: "Status",
      filter: (
        <ChoiceList
          title="status"
          titleHidden
          choices={[
            { label: "Active", value: "active" },
            { label: "Drafts", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          selected={status || []}
          onChange={handleStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "type",
      label: "Type",
      filter: (
        <ChoiceList
          title="Type"
          titleHidden
          choices={[
            { label: "Assuré", value: "insured" },
            { label: "Non assuré", value: "uninsured" },
          ]}
          selected={type || []}
          onChange={handleTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
  ];
  const appliedFilters = [];
  if (status && !isEmpty(status)) {
    const key = "status";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, status),
      onRemove: handleStatusRemove,
    });
  }
  if (type && !isEmpty(type)) {
    const key = "type";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, type),
      onRemove: handleTypeRemove,
    });
  }
  

  const loader_datas = useLoaderData()
  const products_list = loader_datas.products;
  const products = [];
  const insured_products = loader_datas.insured_products;
  const meta_fields =  loader_datas.meta_fields;

  // console.log(meta_fields)

  const currencyCodes = {
    EUR : "€ ",
    USD : "$ " 
  };

  for (const product of products_list.nodes) {
    const is_insured = insured_products.filter(insured_product => insured_product.product_id == product.id).length>0
    let product_object = {
      id: product.id,
      featuredImage: product.featuredImage?.url ? product.featuredImage.url : ImageMajor,
      price: (currencyCodes[product.priceRange.minVariantPrice.currencyCode]?? product.priceRange.minVariantPrice.currencyCode )+ product.priceRange.minVariantPrice.amount,
      product: product.title,
      status: product.status=="ACTIVE"? <Badge status="info" >Publié</Badge> : <Badge>Non publié</Badge>,
      inventory: product.totalInventory,
      vendor: product.vendor,
      type: is_insured? <Badge  progress="complete" status="success">Assuré</Badge> : <Badge  progress="incomplete" status="attention">Non Assuré</Badge>
    }

    // console.log(product_object.id)

    products.push( product_object )  
  }


  const resourceName = {
    singular: "product",
    plural: "products",
  };
  let { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);
  const rowMarkup = products.map(
    (
      { id, featuredImage, product, price, status, inventory, type, vendor },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>                       
          <Thumbnail
            source={featuredImage}
            alt={"product image or placeholder"}
            size="small"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{product}</IndexTable.Cell>
        <IndexTable.Cell>{price}</IndexTable.Cell>
        <IndexTable.Cell>{status}</IndexTable.Cell>
        <IndexTable.Cell>{inventory}</IndexTable.Cell>
        <IndexTable.Cell>{vendor}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

    
  const fetcher = useFetcher();
  const fetchSelectedProducts = (button_action)=>{

    fetcher.submit({ data:JSON.stringify(selectedResources), action:button_action }, { method:'post' })
  
  }

  const isDone = fetcher.state === "idle" && fetcher.data != null;

  if(isDone){ 
    // console.log('selectedResources : ' + selectedResources)
    selectedResources = [] 
  }


  return (
    <Page fullWidth
      title={"Produits"}
      primaryAction={
        {content: "Ajouter une assurance",
        onAction: () =>{
          fetchSelectedProducts('add_insurance')
        }
      }}
      secondaryActions={[
        { content: "Filtrer par Collections",
          accessibilityLabel: "Filter by Collection",
          onAction: () => alert ("Filtrer les produits par collections")
        },
        { content: "Retirer l'assurance",
          accessibilityLabel: "Revoke Insurance",
          onAction: () => {
            fetchSelectedProducts('revoke_insurance')
          }
        },
      ]}
    >
      <Box paddingBlockEnd="4">
        <Card padding="0">
          <IndexFilters 
            sortOptions={sortOptions}
            sortSelected={sortSelected}
            queryValue={queryValue}
            queryPlaceholder="Filtrer les résultats"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={() => {}}
            onSort={setSortSelected}
            primaryAction={primaryAction}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            onCreateNewView={onCreateNewView}
            filters={filters}
            appliedFilters={appliedFilters}
            onClearAll={handleFiltersClearAll}
            mode={mode}
            setMode={setMode}
          />
            <IndexTable 
              resourceName={resourceName}
              itemCount={products.length}
              selectedItemsCount={
                allResourcesSelected ? "Tout" : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              sortable={[false, true, true, true, true, true, true]}
              headings={[
                {title: ''},
                {title: "Produit"},
                {title: "Prix", alignment: "end"},
                {title: "Statut"},
                {title: "Stock"},
                {title: "Fournisseur"},
                {title: "Assurance"}
              ]}
            >
              {rowMarkup}
            </IndexTable>
        </Card>
        </Box>
    </Page>  
  )
}