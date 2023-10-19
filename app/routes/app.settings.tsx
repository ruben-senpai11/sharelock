import { json } from "@remix-run/node";
import {
  Page,
  Text,
  Button,
  Card, 
  VerticalStack,
  HorizontalStack,
  HorizontalGrid,
  Box,
  Link,
  TextField,
  Icon
} from "@shopify/polaris";

import {
  LinkMinor
} from '@shopify/polaris-icons';

import {useState, useCallback} from 'react';
import shopify from '../shopify.server'
import { useLoaderData } from '@remix-run/react'

export async function loader ({ request }){
  const { admin } = await shopify.authenticate.admin(request);
  const response = await admin.graphql(`
  {
    shop {
      name
      myshopifyDomain
    }
  }`)

  const { data: { shop } } = await response.json();
     
  return shop
};

export default function Index() {

  const [mailValue, setMailFieldValue] = useState('');

  const mailFieldChange = useCallback(
    (value: string) => setMailFieldValue(value),
    [],
  );

  const [storeNameValue, setStoreFieldValue] = useState('');

  const storeNameChange = useCallback(
    (value: string) => setStoreFieldValue(value),
    [],
  );

  const [userNameValue, setUserNameValue] = useState('');

  const userNameChange = useCallback(
    (value: string) => setUserNameValue(value),
    [],
  );

  const [apiKeyValue, setApiKeyValue] = useState('');

  const apiKeyChange = useCallback(
    (value: string) => setApiKeyValue(value),
    [],
  );

  function display(){
    alert('Username : ' + userNameValue)
  }

  // const result = JSON.stringify(useLoaderData());
  const result = useLoaderData();
  const domain = result.myshopifyDomain
  const appearance_url = 'https://'+ domain +'/admin/themes/current/editor?template=product&addAppBlockId=c0ea60ea-cbfb-4542-a215-5ec48cf85fea/insurance&target=mainSection'

  return (
      
    <Page fullWidth
      title={"Paramètres"}
      // primaryAction={{content: "Enregistrer"}}
    >
      <VerticalStack gap={{ xs: "8", sm: "4" }}>
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 2 }}
            paddingInlineEnd={{ xs: 4, sm: 2 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Authentification
              </Text>
              <Box paddingBlockStart ="2" paddingBlockEnd ="2">
                <Text as="span" variant="bodyMd">
                  Afin d'accéder à toutes nos fonctionnalités, 
                  veuillez renseigner vos informations, ainsi que votre   
                </Text>{" "}
                <Link url="#" target="_blank">clé  API</Link>{""}
              </Box>
            </VerticalStack>
          </Box>
          <Card roundedAbove="sm">
            <VerticalStack gap="4">
              <TextField label="Nom d'utilisateur" value={userNameValue} onChange={userNameChange} autoComplete="off" />
              <TextField label="Nom de la boutique" value={storeNameValue} onChange={storeNameChange} autoComplete="off" />
              <TextField type="email" label="Adresse Mail" autoComplete="email" value={mailValue} onChange={mailFieldChange} />
              <TextField label="Clé API" value={apiKeyValue} onChange={apiKeyChange} autoComplete="off" />
            </VerticalStack>
            <Box paddingBlockStart="4">
              <HorizontalStack align="end">
                <Button primary onClick={display} >Enregistrer</Button>
              </HorizontalStack>
            </Box>
          </Card>
        </HorizontalGrid>
        <HorizontalGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
          <Box
            as="section"
            paddingInlineStart={{ xs: 4, sm: 2 }}
            paddingInlineEnd={{ xs: 4, sm: 2 }}
          >
            <VerticalStack gap="4">
              <Text as="h3" variant="headingMd">
                Apparence
              </Text>
              <Box paddingBlockStart ="2" paddingBlockEnd ="2">
                <Text as="span">
                  Personaliser l'affichage des offres d'assurances sur votre boutique
                </Text>
              </Box>
            </VerticalStack>
          </Box>
          <Card roundedAbove="sm">
            <VerticalStack gap="4">
              <Box paddingBlockStart ="2" paddingBlockEnd ="1">
                <HorizontalStack align="space-evenly">
                  <Text as="p" variant="bodyLg"> Personnalisez l'apparence des offres d'assurance depuis les {" "}
                    <Link url={appearance_url}
                    target="_blank" >
                      paramètres du thème de votre boutique
                    </Link>
                    
                  </Text>
                  <Text as="p">                    
                    <Icon
                      source={LinkMinor}
                      color="interactive"
                    />
                  </Text>
                </HorizontalStack>
              </Box>
            </VerticalStack>
          </Card>
        </HorizontalGrid>
      </VerticalStack>
      <Box paddingBlockEnd ="4"></Box>
    </Page>
  );
}
