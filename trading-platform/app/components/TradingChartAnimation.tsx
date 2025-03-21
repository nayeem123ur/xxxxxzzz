"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const TradingChartAnimation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827) // Dark background
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5

    // Candlestick data (matching the image pattern)
    const candleData = [
      { open: 2, close: -2, high: 3, low: -3, color: "red" },
      { open: -1, close: 2, high: 3, low: -2, color: "green" },
      { open: 2, close: -1, high: 2, low: -2, color: "red" },
      { open: -1, close: 1, high: 2, low: -2, color: "green" },
      { open: 1, close: -1, high: 2, low: -2, color: "red" },
      { open: -1, close: 2, high: 3, low: -2, color: "green" },
      { open: 2, close: -2, high: 3, low: -3, color: "red" },
      { open: -2, close: 3, high: 4, low: -3, color: "green" },
    ]

    // Create candlesticks
    const candlesticks: THREE.Group[] = []
    candleData.forEach((data, index) => {
      const group = new THREE.Group()

      // Create body
      const bodyHeight = Math.abs(data.close - data.open)
      const bodyGeometry = new THREE.BoxGeometry(0.8, bodyHeight, 0.8)
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: data.color === "green" ? 0x00ff00 : 0xff0000,
        shininess: 100,
        specular: 0x444444,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = (data.close + data.open) / 2
      group.add(body)

      // Create wick
      const wickGeometry = new THREE.CylinderGeometry(0.1, 0.1, Math.abs(data.high - data.low), 8)
      const wickMaterial = new THREE.MeshPhongMaterial({
        color: data.color === "green" ? 0x00ff00 : 0xff0000,
        shininess: 100,
        specular: 0x444444,
      })
      const wick = new THREE.Mesh(wickGeometry, wickMaterial)
      wick.position.y = (data.high + data.low) / 2
      group.add(wick)

      // Position the group
      group.position.x = index * 2 - 7
      group.position.z = 0
      scene.add(group)
      candlesticks.push(group)
    })

    // Add grid
    const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222)
    gridHelper.position.y = -5
    scene.add(gridHelper)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 1)
    pointLight1.position.set(10, 10, 10)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x00ffff, 1)
    pointLight2.position.set(-10, -10, -10)
    scene.add(pointLight2)

    // Camera position
    camera.position.set(0, 5, 15)
    camera.lookAt(0, 0, 0)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)

      candlesticks.forEach((candlestick, index) => {
        candlestick.position.y = Math.sin(Date.now() * 0.001 + index) * 0.2
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 z-[-1]" />
}

export default TradingChartAnimation

