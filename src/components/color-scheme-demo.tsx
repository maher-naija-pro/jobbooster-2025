'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function ColorSchemeDemo() {
    return (
        <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-gradient">Modern Color Scheme</h1>
                <p className="text-muted-foreground">A contemporary design system with vibrant gradients and modern shadows</p>
            </div>

            {/* Color Palette Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="gradient-primary text-white">
                    <CardHeader>
                        <CardTitle>Primary Gradient</CardTitle>
                        <CardDescription className="text-white/80">
                            Modern blue-purple gradient for primary actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                            Primary Action
                        </Button>
                    </CardContent>
                </Card>

                <Card className="gradient-secondary text-white">
                    <CardHeader>
                        <CardTitle>Secondary Gradient</CardTitle>
                        <CardDescription className="text-white/80">
                            Teal-green gradient for secondary actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                            Secondary Action
                        </Button>
                    </CardContent>
                </Card>

                <Card className="gradient-accent text-white">
                    <CardHeader>
                        <CardTitle>Accent Gradient</CardTitle>
                        <CardDescription className="text-white/80">
                            Orange-purple gradient for accent elements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                            Accent Action
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Button Showcase */}
            <Card>
                <CardHeader>
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>Modern button styles with enhanced shadows and transitions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                        <Button>Default Button</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Badge Showcase */}
            <Card>
                <CardHeader>
                    <CardTitle>Badge Variants</CardTitle>
                    <CardDescription>Modern badge styles with the new color palette</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Text Gradients */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-gradient">Text Gradients</CardTitle>
                    <CardDescription>Beautiful gradient text effects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h2 className="text-2xl font-bold text-gradient">Primary Gradient Text</h2>
                    <h3 className="text-xl font-semibold text-gradient-accent">Accent Gradient Text</h3>
                    <p className="text-muted-foreground">
                        Regular text with proper contrast and readability maintained.
                    </p>
                </CardContent>
            </Card>

            {/* Glass Effect Demo */}
            <Card className="glass-effect">
                <CardHeader>
                    <CardTitle>Glass Effect</CardTitle>
                    <CardDescription>Modern glassmorphism design</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        This card uses a glass effect with backdrop blur and transparency.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
