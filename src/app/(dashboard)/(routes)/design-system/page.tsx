import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Divider } from "@/components/ui/divider";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Skeleton, CardSkeleton, KPICardSkeleton, TableSkeleton } from "@/components/ui/skeleton";
import { HeroBanner } from "@/components/ui/hero-banner";

export const metadata: Metadata = {
  title: "Design System | PANTHERA",
  description: "Design system components for the PANTHERA dashboard",
};

export default function DesignSystemPage() {
  return (
    <Container className="py-8">
      <Heading variant="h1" className="mb-8">
        Design System
      </Heading>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Typography
        </Heading>
        <Divider spacing />

        <Grid cols={1} gap={4}>
          <GridItem>
            <Heading variant="display">Display Heading</Heading>
            <Text variant="muted">Font size: 3.75rem (60px)</Text>
          </GridItem>
          <GridItem>
            <Heading variant="h1">Heading 1</Heading>
            <Text variant="muted">Font size: 3rem (48px)</Text>
          </GridItem>
          <GridItem>
            <Heading variant="h2">Heading 2</Heading>
            <Text variant="muted">Font size: 2.25rem (36px)</Text>
          </GridItem>
          <GridItem>
            <Heading variant="h3">Heading 3</Heading>
            <Text variant="muted">Font size: 1.875rem (30px)</Text>
          </GridItem>
          <GridItem>
            <Heading variant="h4">Heading 4</Heading>
            <Text variant="muted">Font size: 1.5rem (24px)</Text>
          </GridItem>
          <GridItem>
            <Heading variant="h5">Heading 5</Heading>
            <Text variant="muted">Font size: 1.25rem (20px)</Text>
          </GridItem>
          <GridItem>
            <Heading variant="h6">Heading 6</Heading>
            <Text variant="muted">Font size: 1.125rem (18px)</Text>
          </GridItem>
        </Grid>

        <Divider spacing />

        <Grid cols={1} gap={4}>
          <GridItem>
            <Text variant="lead">Lead Text</Text>
            <Text variant="muted">Font size: 1.125rem (18px)</Text>
          </GridItem>
          <GridItem>
            <Text>Default Text</Text>
            <Text variant="muted">Font size: 1rem (16px)</Text>
          </GridItem>
          <GridItem>
            <Text variant="small">Small Text</Text>
            <Text variant="muted">Font size: 0.875rem (14px)</Text>
          </GridItem>
          <GridItem>
            <Text variant="xs">Extra Small Text</Text>
            <Text variant="muted">Font size: 0.75rem (12px)</Text>
          </GridItem>
        </Grid>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Colors
        </Heading>
        <Divider spacing />

        <Heading variant="h4" className="mb-4">
          Primary Colors
        </Heading>
        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <div className="h-20 rounded-md bg-primary-purple"></div>
            <Text variant="small" weight="medium" className="mt-2">
              Primary Purple
            </Text>
            <Text variant="xs" className="text-gray-500">
              #8b5cf6
            </Text>
          </GridItem>
          <GridItem>
            <div className="h-20 rounded-md bg-primary-purple-dark"></div>
            <Text variant="small" weight="medium" className="mt-2">
              Primary Purple Dark
            </Text>
            <Text variant="xs" className="text-gray-500">
              #7c3aed
            </Text>
          </GridItem>
        </Grid>

        <Heading variant="h4" className="mb-4">
          Secondary Colors
        </Heading>
        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <div className="h-20 rounded-md bg-secondary-blue"></div>
            <Text variant="small" weight="medium" className="mt-2">
              Secondary Blue
            </Text>
            <Text variant="xs" className="text-gray-500">
              #3b82f6
            </Text>
          </GridItem>
          <GridItem>
            <div className="h-20 rounded-md bg-secondary-green"></div>
            <Text variant="small" weight="medium" className="mt-2">
              Secondary Green
            </Text>
            <Text variant="xs" className="text-gray-500">
              #10b981
            </Text>
          </GridItem>
        </Grid>

        <Heading variant="h4" className="mb-4">
          Brand Colors
        </Heading>
        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <div className="h-20 rounded-md bg-kb-home"></div>
            <Text variant="small" weight="medium" className="mt-2">
              KB Home
            </Text>
            <Text variant="xs" className="text-gray-500">
              #f59e0b
            </Text>
          </GridItem>
          <GridItem>
            <div className="h-20 rounded-md bg-nvr"></div>
            <Text variant="small" weight="medium" className="mt-2">
              NVR
            </Text>
            <Text variant="xs" className="text-gray-500">
              #991b1b
            </Text>
          </GridItem>
          <GridItem>
            <div className="h-20 rounded-md bg-lennar"></div>
            <Text variant="small" weight="medium" className="mt-2">
              Lennar
            </Text>
            <Text variant="xs" className="text-gray-500">
              #1e40af
            </Text>
          </GridItem>
          <GridItem>
            <div className="h-20 rounded-md bg-richmond"></div>
            <Text variant="small" weight="medium" className="mt-2">
              Richmond
            </Text>
            <Text variant="xs" className="text-gray-500">
              #dc2626
            </Text>
          </GridItem>
        </Grid>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Hero Banner
        </Heading>
        <Divider spacing />

        <div className="space-y-8">
          <div>
            <Heading variant="h4" className="mb-4">
              Default Hero Banner
            </Heading>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
              primaryAction={{
                label: "Discover now",
                href: "#",
              }}
              secondaryAction={{
                label: "Watch video",
                href: "#",
              }}
            />
          </div>

          <div>
            <Heading variant="h4" className="mb-4">
              Hero Banner with Custom Gradient
            </Heading>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
              primaryAction={{
                label: "Discover now",
                href: "#",
              }}
              gradientDirection="to-br"
              gradientFromColor="from-secondary-blue"
              gradientToColor="to-primary-purple"
            />
          </div>

          <div>
            <Heading variant="h4" className="mb-4">
              Hero Banner without Actions
            </Heading>
            <HeroBanner
              title="Revolutionising Real Estate with Data Insights"
              subtitle="Unlock actionable intelligence and make data-driven decisions with our comprehensive analytics platform."
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Buttons
        </Heading>
        <Divider spacing />

        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <Button variant="default">Default</Button>
          </GridItem>
          <GridItem>
            <Button variant="secondary">Secondary</Button>
          </GridItem>
          <GridItem>
            <Button variant="outline">Outline</Button>
          </GridItem>
          <GridItem>
            <Button variant="ghost">Ghost</Button>
          </GridItem>
          <GridItem>
            <Button variant="link">Link</Button>
          </GridItem>
          <GridItem>
            <Button variant="destructive">Destructive</Button>
          </GridItem>
          <GridItem>
            <Button variant="success">Success</Button>
          </GridItem>
          <GridItem>
            <Button variant="info">Info</Button>
          </GridItem>
        </Grid>

        <Heading variant="h4" className="mb-4">
          Button Sizes
        </Heading>
        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <Button size="sm">Small</Button>
          </GridItem>
          <GridItem>
            <Button size="default">Default</Button>
          </GridItem>
          <GridItem>
            <Button size="lg">Large</Button>
          </GridItem>
          <GridItem>
            <Button size="icon">🔍</Button>
          </GridItem>
        </Grid>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Cards
        </Heading>
        <Divider spacing />

        <Grid cols={1} colsMd={2} colsLg={3} gap={6}>
          <GridItem>
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>This is a default card component</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>This is the card content area where the main information is displayed.</Text>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem>
            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline Card</CardTitle>
                <CardDescription>This is an outline card variant</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>This is the card content area where the main information is displayed.</Text>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Action</Button>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem>
            <Card variant="filled">
              <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>This is a filled card variant</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>This is the card content area where the main information is displayed.</Text>
              </CardContent>
              <CardFooter>
                <Button variant="secondary">Action</Button>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>This is an elevated card variant</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>This is the card content area where the main information is displayed.</Text>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </GridItem>

          <GridItem>
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>This card has hover effects</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>Hover over this card to see the interactive effects.</Text>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </GridItem>
        </Grid>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Badges
        </Heading>
        <Divider spacing />

        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <Badge variant="default">Default</Badge>
          </GridItem>
          <GridItem>
            <Badge variant="secondary">Secondary</Badge>
          </GridItem>
          <GridItem>
            <Badge variant="outline">Outline</Badge>
          </GridItem>
          <GridItem>
            <Badge variant="success">Success</Badge>
          </GridItem>
          <GridItem>
            <Badge variant="warning">Warning</Badge>
          </GridItem>
          <GridItem>
            <Badge variant="danger">Danger</Badge>
          </GridItem>
          <GridItem>
            <Badge variant="info">Info</Badge>
          </GridItem>
        </Grid>

        <Heading variant="h4" className="mb-4">
          Badge Sizes
        </Heading>
        <Grid cols={2} colsMd={3} colsLg={4} gap={4} className="mb-8">
          <GridItem>
            <Badge size="sm">Small</Badge>
          </GridItem>
          <GridItem>
            <Badge size="default">Default</Badge>
          </GridItem>
          <GridItem>
            <Badge size="lg">Large</Badge>
          </GridItem>
        </Grid>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Grid System
        </Heading>
        <Divider spacing />

        <Text className="mb-4">Basic 12-column grid system with responsive breakpoints</Text>

        <Grid cols={1} colsMd={2} colsLg={4} gap={4} className="mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <GridItem key={i}>
              <div className="rounded bg-gray-100 p-4 text-center">
                <Text>Column {i + 1}</Text>
              </div>
            </GridItem>
          ))}
        </Grid>

        <Grid cols={1} colsMd={3} colsLg={6} gap={4} className="mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <GridItem key={i}>
              <div className="rounded bg-gray-100 p-4 text-center">
                <Text>Column {i + 1}</Text>
              </div>
            </GridItem>
          ))}
        </Grid>

        <Grid cols={1} colsMd={4} colsLg={12} gap={4} className="mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <GridItem key={i}>
              <div className="rounded bg-gray-100 p-4 text-center">
                <Text>{i + 1}</Text>
              </div>
            </GridItem>
          ))}
        </Grid>

        <Heading variant="h4" className="mb-4">
          Column Spans
        </Heading>
        <Grid cols={12} gap={4}>
          <GridItem span={12}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 12</Text>
            </div>
          </GridItem>
          <GridItem span={6}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 6</Text>
            </div>
          </GridItem>
          <GridItem span={6}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 6</Text>
            </div>
          </GridItem>
          <GridItem span={4}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 4</Text>
            </div>
          </GridItem>
          <GridItem span={4}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 4</Text>
            </div>
          </GridItem>
          <GridItem span={4}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 4</Text>
            </div>
          </GridItem>
          <GridItem span={3}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 3</Text>
            </div>
          </GridItem>
          <GridItem span={3}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 3</Text>
            </div>
          </GridItem>
          <GridItem span={3}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 3</Text>
            </div>
          </GridItem>
          <GridItem span={3}>
            <div className="rounded bg-gray-100 p-4 text-center">
              <Text>span 3</Text>
            </div>
          </GridItem>
        </Grid>
      </section>

      <section className="mb-12">
        <Heading variant="h2" className="mb-4">
          Loading Skeletons
        </Heading>
        <Divider spacing />

        <Grid cols={1} colsMd={2} colsLg={3} gap={6} className="mb-8">
          <GridItem>
            <Heading variant="h4" className="mb-4">
              Basic Skeleton
            </Heading>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </GridItem>

          <GridItem>
            <Heading variant="h4" className="mb-4">
              Card Skeleton
            </Heading>
            <CardSkeleton />
          </GridItem>

          <GridItem>
            <Heading variant="h4" className="mb-4">
              KPI Card Skeleton
            </Heading>
            <KPICardSkeleton />
          </GridItem>
        </Grid>

        <Heading variant="h4" className="mb-4">
          Table Skeleton
        </Heading>
        <TableSkeleton rows={3} columns={4} />
      </section>
    </Container>
  );
}
