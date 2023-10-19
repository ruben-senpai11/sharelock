import {json} from "@remix-run/node"
import{
    Page,
    LegacyCard,
    EmptyState, 
    Link
} from "@shopify/polaris";

export default function Index() {
    return(
      <Page fullWidth>
        <LegacyCard sectioned>
          <EmptyState
            heading="Manage your inventory transfers"
            action={{
              content: 'Configurer le modèle', 
              // url='/app/products'
            }}
            secondaryAction={{
              content: 'En savoir plus',
              url: '',
            }}
            footerContent={
              <p>
                If you don’t want to add a transfer, you can import your inventory
                from{' '}
                <Link monochrome url="/settings">
                  settings
                </Link>
                .
              </p>
            }
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Track and receive your incoming inventory from suppliers.</p>
          </EmptyState>
        </LegacyCard>
      </Page>
    )
}