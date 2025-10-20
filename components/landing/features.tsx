import { Zap, Shield, Layout, Code2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Built with Next.js and optimized for performance. Experience instant page loads and smooth navigation.',
  },
  {
    icon: Code2,
    title: 'Type-Safe',
    description:
      'End-to-end type safety with TypeScript, tRPC, and Zod. Catch errors before they reach production.',
  },
  {
    icon: Layout,
    title: 'Beautiful Design',
    description:
      'Clean, modern UI built with Tailwind CSS and shadcn/ui. Responsive across all devices.',
  },
  {
    icon: Shield,
    title: 'Reliable & Secure',
    description:
      'Built on proven technologies with PostgreSQL database and robust data validation.',
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Why Choose BlogHub?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern technologies and best practices to deliver a superior blogging experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-2 hover:border-blue-200 transition-colors">
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
