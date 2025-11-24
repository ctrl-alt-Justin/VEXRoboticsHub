import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 200);
            mouseY.set(e.clientY - 200);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let points: { x: number; y: number; originX: number; originY: number }[] = [];
        const gridSize = 40; // Distance between points
        const connectionDistance = 100; // Max distance to draw lines
        const mouseRadius = 150; // Radius of mouse influence

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPoints();
        };

        const initPoints = () => {
            points = [];
            for (let x = 0; x < canvas.width + gridSize; x += gridSize) {
                for (let y = 0; y < canvas.height + gridSize; y += gridSize) {
                    points.push({ x, y, originX: x, originY: y });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update points based on mouse position
            // We need current mouse position from the spring values or direct event
            // Since we are inside the loop, let's get the raw mouse position from the window event listener we added above?
            // Actually, let's just track it in a ref for the canvas loop to avoid re-renders
        };

        // We need a separate mouse tracker for the canvas loop to avoid React state/hook complexity inside the loop
        let currentMouseX = -1000;
        let currentMouseY = -1000;

        const updateMouse = (e: MouseEvent) => {
            currentMouseX = e.clientX;
            currentMouseY = e.clientY;
        };
        window.addEventListener('mousemove', updateMouse);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;

            points.forEach(point => {
                // Calculate distance to mouse
                const dx = currentMouseX - point.originX;
                const dy = currentMouseY - point.originY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Displace point if within radius
                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    // Push away
                    point.x = point.originX + Math.cos(angle) * force * 20;
                    point.y = point.originY + Math.sin(angle) * force * 20;
                } else {
                    // Return to origin
                    point.x += (point.originX - point.x) * 0.1;
                    point.y += (point.originY - point.y) * 0.1;
                }

                // Draw point (optional, maybe just lines?)
                // ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                // ctx.beginPath();
                // ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                // ctx.fill();
            });

            // Draw lines connecting close points
            // Optimization: only check neighbors? Or just check all (expensive for many points)
            // For a grid, we can just draw lines to right and bottom neighbors

            // Let's try a different approach: minimal lines. 
            // Just draw the grid lines but distorted.

            ctx.beginPath();
            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // Find neighbors (right and bottom)
                // Since points are generated in loops, we can calculate indices?
                // Or just simple distance check for "nearest" is easier visually but expensive O(N^2)
                // Let's stick to the grid structure logic.
                // But since we flattened the array, it's harder.
                // Let's just re-loop with x/y structure for drawing
            }

            // Re-implementing the loop structure for drawing to make connections easy
            const cols = Math.ceil(canvas.width / gridSize) + 1;
            const rows = Math.ceil(canvas.height / gridSize) + 1;

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                const col = Math.floor(i / rows); // Wait, my loop order was x then y. 
                // x loop (outer), y loop (inner). 
                // points.push happened in inner loop.
                // So for each x, we have all y's.
                // i % rows is the y index? No.
                // Let's restart the loop logic for clarity.
            }
        };

        // Let's redo the animation loop with a simpler approach for the "futuristic lines"
        // Instead of a full mesh, let's do floating particles that connect?
        // Or a distorted grid. Distorted grid is very "futuristic UI".

        const renderLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update points
            points.forEach(point => {
                const dx = currentMouseX - point.originX;
                const dy = currentMouseY - point.originY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    point.x = point.originX - Math.cos(angle) * force * 30; // Push away
                    point.y = point.originY - Math.sin(angle) * force * 30;
                } else {
                };
            }, []);

            return (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Existing Gradient Blobs */}
                    <motion.div
                        style={{ x: springX, y: springY }}
                        className="absolute w-[400px] h-[400px] bg-red-500/20 rounded-full blur-[100px] mix-blend-screen"
                    />

                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 90, 0]
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-red-500/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.5, 0.3],
                            x: [0, 100, 0]
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-orange-500/20 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                            y: [0, -50, 0]
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] bg-yellow-500/20 rounded-full blur-[120px]"
                    />

                    {/* Dark overlay for better readability */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Canvas for Futuristic Lines */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 z-10 opacity-40"
                    />
                </div>
            );
        }
