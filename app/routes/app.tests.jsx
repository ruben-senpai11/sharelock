import { json } from "@remix-run/node"
import{
    Page,
    Link,
    Thumbnail
} from "@shopify/polaris";

import { DiamondAlertMajor, ImageMajor } from "@shopify/polaris-icons";

import shopify from "../shopify.server";
import {useLoaderData} from '@remix-run/react';

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
          status
          productType
          vendor
          priceRange {
            maxVariantPrice {
              amount
            }
          }
        }
      }
      
    }`);

  const { data: { products },  } = await response.json();
  return products;
}

export default function Index() {
  // useLoaderDa  ta();  
  
      console.log('Entered here')

      const products = useLoaderData();

      console.log(products)
      
      function getProductImage(product){
      }
      
    return(

        <Page fullWidth>
            <ui-title-bar title="Tests">                
            </ui-title-bar>
                    
            <section className="w-full gap-4">
              <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
                Products
              </h2>
              <div className="">
                {products.nodes.map((product) => {
                  return (
                    <div className="grid gap-5">
                                      
                      <Thumbnail
                        source={product.featuredImage?.url ? product.featuredImage.url : ImageMajor}
                        alt={"product image or placeholder"}
                        size="small"
                      />
                        {/* if({product.featuredImage.url}){
                          <img alt={product.title} src={product.featuredImage.url} width="500px" height="500px"></img>
                        } */}
                      <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                          {product.title} 
                      </h2>
                      </div>
                    // </Link> 
                  );
                })}
              </div>
            </section>
          
        </Page>

    )
}


// export async function loader({context}) {
//   const PRODUCTS_QUERY = `#graphql
//     query products {
//       products(first: 3) {
//         edges {
//           node {
//             id
//             title
//           }
//         }
//       }
//     }
//   `;
//   const {products} = await context.storefront.query(PRODUCTS_QUERY);
//   return json({products});
// }