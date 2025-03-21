"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import * as THREE from "three"

interface AnimatedButtonBackgroundProps {
  width: number
  height: number
}

const AnimatedButtonBackground: React.FC<AnimatedButtonBackgroundProps> = ({ width, height }) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })

    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
    const material = new THREE.MeshPhongMaterial({
      color: 0x6a0dad,
      shininess: 100,
      specular: 0xffffff,
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    const light = new THREE.PointLight(0xffffff, 1, 100)
    light.position.set(0, 0, 10)
    scene.add(light)

    camera.position.z = 5

    const animate = () => {
      requestAnimationFrame(animate)

      torus.rotation.x += 0.01
      torus.rotation.y += 0.01

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [width, height])

  return <div ref={mountRef} className="absolute inset-0 z-[-1]" />
}

export default AnimatedButtonBackground

