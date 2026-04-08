'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GeometricBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    // إعداد المشهد (Scene)
    const scene = new THREE.Scene()
    // إضافة ضباب أسود للدمج مع الخلفية الداكنة
    scene.fog = new THREE.FogExp2(0x000000, 0.02)

    // إعداد الكاميرا
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    camera.position.x = 2.5

    // إعداد المصير (Renderer)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    // إضافة العنصر (Canvas) إلى الـ DOM
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement)

    // إنشاء مجموعة لتنظيم العناصر
    const mainGroup = new THREE.Group()
    scene.add(mainGroup)

    // 1. الكرة الخارجية (Wireframe) - بيضاء شفافة
    const sphereGeo = new THREE.IcosahedronGeometry(3.5, 2)
    const sphereMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true,
      transparent: true,
      opacity: 0.1 
    })
    const mainSphere = new THREE.Mesh(sphereGeo, sphereMat)
    mainGroup.add(mainSphere)

    // 2. اللب الداخلي (Core) - رمادي فاتح
    const coreGeo = new THREE.IcosahedronGeometry(1.5, 0)
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x111111,
      flatShading: true
    })
    const coreSphere = new THREE.Mesh(coreGeo, coreMat)
    mainGroup.add(coreSphere)

    // 3. الجزيئات المحيطة (Particles)
    const particlesGeo = new THREE.BufferGeometry()
    const particlesCount = 200
    const posArray = new Float32Array(particlesCount * 3)
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMat = new THREE.PointsMaterial({ size: 0.03, color: 0xffffff, transparent: true, opacity: 0.2 })
    const particles = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particles)

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)

    // متغيرات الحركة (Scroll & Mouse)
    let scrollY = 0
    let targetY = 0
    let mouseX = 0
    let mouseY = 0

    const onScroll = () => {
      scrollY = window.scrollY
      targetY = scrollY * 0.01
    }
    window.addEventListener('scroll', onScroll)

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // حلقة التحريك (Animation Loop)
    const animate = () => {
      requestAnimationFrame(animate)
      
      // حركة المجموعة بناءً على السكرول
      mainGroup.position.y += (targetY - mainGroup.position.y) * 0.05
      
      // دوران الكرات
      mainSphere.rotation.y += 0.001
      mainSphere.rotation.x += 0.0005
      coreSphere.rotation.y -= 0.005
      coreSphere.rotation.z += 0.005
      
      // دوران الجزيئات
      particles.rotation.y -= 0.0005
      
      // تحريك الكاميرا بناءً على الماوس
      camera.position.x += (2.5 + mouseX * 0.2 - camera.position.x) * 0.05
      camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05
      camera.lookAt(0, mainGroup.position.y, 0)
      
      renderer.render(scene, camera)
    }
    animate()

    // التعامل مع تغيير حجم النافذة
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // تنظيف الذاكرة (Cleanup) عند إزالة المكون
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
    }
  }, [])

  return (
    // تأكد من أن الستايل يجعلها في الخلفية ولا تمنع النقرات (pointer-events-none)
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none" 
      style={{ background: 'transparent' }} 
    />
  )
}