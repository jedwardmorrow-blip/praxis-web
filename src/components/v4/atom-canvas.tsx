"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js"
import { RenderPass } from "three/addons/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js"

import { ORBITS, EDGES, PALETTE, type AtomNode } from "./atom-data"

// The heavy three.js canvas. Mounted only after the parent loader signals
// the section is in viewport AND prefers-reduced-motion is unset.

type Hovered = {
  cat: string
  name: string
  desc: string
  meta: string
  x: number
  y: number
} | null

export default function AtomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<Hovered>(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    const W = stage.clientWidth
    const H = stage.clientHeight

    // Scene + camera + renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x03101f)
    scene.fog = new THREE.Fog(0x03101f, 18, 32)

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(11, 5.5, 13)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    } catch (error) {
      console.warn("Praxis atom WebGL renderer unavailable; leaving static fallback.", error)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), 0.45, 0.4, 0.72)
    composer.addPass(bloom)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.minDistance = 5
    controls.maxDistance = 22
    controls.maxPolarAngle = Math.PI * 0.85
    controls.minPolarAngle = Math.PI * 0.15
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.45

    // Lighting
    scene.add(new THREE.AmbientLight(0x5a708e, 0.75))
    const keyLight = new THREE.DirectionalLight(0xf1e8d2, 1.05)
    keyLight.position.set(8, 12, 8)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0x8aa0c2, 0.65)
    fillLight.position.set(-8, -2, -6)
    scene.add(fillLight)
    const goldAccent = new THREE.DirectionalLight(0xc9a24b, 0.35)
    goldAccent.position.set(0, 8, -10)
    scene.add(goldAccent)
    const rimLight = new THREE.PointLight(0xc42130, 1.1, 18)
    rimLight.position.set(0, 0, 0)
    scene.add(rimLight)

    const root = new THREE.Group()
    scene.add(root)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 600
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const r = 13 + Math.random() * 9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = r * Math.cos(phi)
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({
      color: PALETTE.paper,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
    const starPoints = new THREE.Points(starGeo, starMaterial)
    scene.add(starPoints)

    // Track everything we create so we can dispose on unmount.
    const disposables: Array<{ dispose: () => void }> = [
      starGeo,
      starMaterial,
      bloom,
      composer,
      renderer,
      controls,
    ]

    type NodeRecord = {
      mesh: THREE.Mesh
      node: AtomNode
      orbit: number
      orbitGroup: THREE.Group | null
    }
    const orbitGroups: THREE.Group[] = []
    const allNodes: Record<string, NodeRecord> = {}
    const allMeshes: THREE.Mesh[] = []

    ORBITS.forEach((orbit, oIdx) => {
      if (orbit.r === 0) {
        const node = orbit.nodes[0]
        const geo = new THREE.SphereGeometry(node.size, 48, 48)
        const mat = new THREE.MeshStandardMaterial({
          color: 0x8c1722,
          emissive: PALETTE.red,
          emissiveIntensity: 1.4,
          roughness: 0.4,
          metalness: 0.2,
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.userData = {
          node,
          baseEmissive: 1.4,
          pulseAmp: 0,
          pulseFreq: 0,
          pulsePhase: 0,
        }
        root.add(mesh)
        allMeshes.push(mesh)
        allNodes[node.id] = { mesh, node, orbit: oIdx, orbitGroup: null }

        const haloGeo = new THREE.SphereGeometry(node.size * 1.6, 32, 32)
        const haloMat = new THREE.MeshBasicMaterial({
          color: PALETTE.red,
          transparent: true,
          opacity: 0.18,
          side: THREE.BackSide,
        })
        const halo = new THREE.Mesh(haloGeo, haloMat)
        mesh.add(halo)

        const ringGeo = new THREE.TorusGeometry(node.size * 2.4, 0.012, 8, 64)
        const ringMat = new THREE.MeshBasicMaterial({
          color: PALETTE.gold,
          transparent: true,
          opacity: 0.6,
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.rotation.x = Math.PI / 2
        mesh.add(ring)

        disposables.push(geo, mat, haloGeo, haloMat, ringGeo, ringMat)
        return
      }

      const og = new THREE.Group()
      og.rotation.x = orbit.tilt
      og.rotation.z = orbit.tilt * 0.5
      og.userData = { speed: orbit.speed ?? 0.05 }
      root.add(og)
      orbitGroups.push(og)

      const isOuter = oIdx === ORBITS.length - 1
      const torusGeo = new THREE.TorusGeometry(orbit.r, isOuter ? 0.008 : 0.012, 8, 160)
      const torusMat = new THREE.MeshBasicMaterial({
        color: PALETTE.gold,
        transparent: true,
        opacity: isOuter ? 0.42 : 0.62,
      })
      const torus = new THREE.Mesh(torusGeo, torusMat)
      torus.rotation.x = Math.PI / 2
      og.add(torus)
      disposables.push(torusGeo, torusMat)

      const dashPoints: THREE.Vector3[] = []
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2
        dashPoints.push(
          new THREE.Vector3(Math.cos(a) * orbit.r, 0, Math.sin(a) * orbit.r)
        )
      }
      const dashGeo = new THREE.BufferGeometry().setFromPoints(dashPoints)
      const dashMat = new THREE.LineDashedMaterial({
        color: PALETTE.gold,
        dashSize: 0.1,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.32,
      })
      const dashLine = new THREE.Line(dashGeo, dashMat)
      dashLine.computeLineDistances()
      og.add(dashLine)
      disposables.push(dashGeo, dashMat)

      const n = orbit.nodes.length
      const angleOffset = oIdx % 2 === 0 ? 0 : Math.PI / n
      orbit.nodes.forEach((node, idx) => {
        const a = (idx / n) * Math.PI * 2 + angleOffset
        const x = Math.cos(a) * orbit.r
        const z = Math.sin(a) * orbit.r

        let mat: THREE.MeshStandardMaterial
        if (node.color === "paper") {
          mat = new THREE.MeshStandardMaterial({
            color: PALETTE.paper,
            emissive: PALETTE.paper,
            emissiveIntensity: 0.65,
            roughness: 0.45,
            metalness: 0.15,
          })
        } else if (node.color === "gold") {
          mat = new THREE.MeshStandardMaterial({
            color: PALETTE.gold,
            emissive: PALETTE.gold,
            emissiveIntensity: 0.95,
            roughness: 0.3,
            metalness: 0.5,
          })
        } else if (node.color === "method") {
          mat = new THREE.MeshStandardMaterial({
            color: PALETTE.gold,
            emissive: PALETTE.gold,
            emissiveIntensity: 0.4,
            roughness: 0.55,
            metalness: 0.25,
            transparent: true,
            opacity: 0.7,
          })
        } else if (node.color === "engagement") {
          mat = new THREE.MeshStandardMaterial({
            color: PALETTE.navyMid,
            emissive: PALETTE.gold,
            emissiveIntensity: 0.4,
            roughness: 0.35,
            metalness: 0.6,
          })
        } else if (node.color === "tool") {
          mat = new THREE.MeshStandardMaterial({
            color: PALETTE.paper,
            emissive: PALETTE.paper,
            emissiveIntensity: 0.32,
            roughness: 0.6,
            metalness: 0.15,
            transparent: true,
            opacity: 0.55,
          })
        } else {
          mat = new THREE.MeshStandardMaterial({
            color: PALETTE.paper,
            emissive: PALETTE.paper,
            emissiveIntensity: 0.4,
          })
        }

        const sphereGeo = new THREE.SphereGeometry(node.size, 48, 48)
        const mesh = new THREE.Mesh(sphereGeo, mat)
        mesh.position.set(x, 0, z)

        const pulseProfiles = {
          build: { amp: 0.55, freq: 1.6 },
          sprint: { amp: 0.35, freq: 1.1 },
          qualify: { amp: 0.18, freq: 0.7 },
        } as const
        const pulseProfile = node.stage
          ? pulseProfiles[node.stage]
          : { amp: 0.1, freq: 0.9 }
        mesh.userData = {
          node,
          baseEmissive: mat.emissiveIntensity,
          pulseAmp: pulseProfile.amp,
          pulseFreq: pulseProfile.freq,
          pulsePhase: Math.random() * Math.PI * 2,
        }

        if (node.color !== "tool" && node.color !== "method") {
          const haloGeo = new THREE.SphereGeometry(node.size * 1.4, 24, 24)
          const haloMat = new THREE.MeshBasicMaterial({
            color: node.color === "paper" ? PALETTE.paper : PALETTE.gold,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide,
          })
          const halo = new THREE.Mesh(haloGeo, haloMat)
          mesh.add(halo)
          disposables.push(haloGeo, haloMat)
        }
        if (node.color === "engagement") {
          const rimGeo = new THREE.TorusGeometry(node.size * 1.05, 0.008, 8, 32)
          const rimMat = new THREE.MeshBasicMaterial({
            color: PALETTE.gold,
            transparent: true,
            opacity: 0.85,
          })
          const rimRing = new THREE.Mesh(rimGeo, rimMat)
          rimRing.rotation.x = Math.PI / 2
          mesh.add(rimRing)
          disposables.push(rimGeo, rimMat)
        }

        og.add(mesh)
        allMeshes.push(mesh)
        allNodes[node.id] = { mesh, node, orbit: oIdx, orbitGroup: og }
        disposables.push(sphereGeo, mat)
      })
    })

    // Edges
    type EdgeRec = {
      from: THREE.Mesh
      to: THREE.Mesh
      line: THREE.Line
      segs: number
      baseOpacity: number
    }
    const edgeLines: EdgeRec[] = []
    EDGES.forEach(([from, to]) => {
      const a = allNodes[from]
      const b = allNodes[to]
      if (!a || !b) return
      const positions = new Float32Array(33 * 3)
      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
      const baseOpacity = 0.62
      const lineMat = new THREE.LineDashedMaterial({
        color: PALETTE.gold,
        dashSize: 0.06,
        gapSize: 0.06,
        transparent: true,
        opacity: baseOpacity,
      })
      const line = new THREE.Line(geo, lineMat)
      scene.add(line)
      edgeLines.push({ from: a.mesh, to: b.mesh, line, segs: 32, baseOpacity })
      disposables.push(geo, lineMat)
    })

    const _v1 = new THREE.Vector3()
    const _v2 = new THREE.Vector3()
    const _ctrl = new THREE.Vector3()
    function updateEdges() {
      edgeLines.forEach((e) => {
        e.from.getWorldPosition(_v1)
        e.to.getWorldPosition(_v2)
        _ctrl.addVectors(_v1, _v2).multiplyScalar(0.5)
        const len = _ctrl.length()
        _ctrl.normalize().multiplyScalar(len * 0.7)
        const curve = new THREE.QuadraticBezierCurve3(_v1.clone(), _ctrl.clone(), _v2.clone())
        const pts = curve.getPoints(e.segs)
        const positions = (e.line.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
        for (let i = 0; i < pts.length; i++) {
          positions[i * 3] = pts[i].x
          positions[i * 3 + 1] = pts[i].y
          positions[i * 3 + 2] = pts[i].z
        }
        e.line.geometry.attributes.position.needsUpdate = true
        e.line.computeLineDistances()
      })
    }

    // Raycaster + hover
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let hoveredId: string | null = null

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const hits = raycaster.intersectObjects(allMeshes, false)
      if (hits.length > 0) {
        const node = (hits[0].object.userData as { node?: AtomNode }).node
        if (node) {
          if (node.id !== hoveredId) {
            hoveredId = node.id
            controls.autoRotate = false
          }
          setHovered({
            cat: `Orbit ${String(allNodes[node.id]?.orbit).padStart(2, "0")} · ${node.cat}`,
            name: node.name,
            desc: node.desc,
            meta: node.meta,
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          })
        }
      } else if (hoveredId) {
        hoveredId = null
        controls.autoRotate = true
        setHovered(null)
      }
    }
    const onMouseLeave = () => {
      hoveredId = null
      controls.autoRotate = true
      setHovered(null)
    }
    canvas.addEventListener("mousemove", onMouseMove)
    canvas.addEventListener("mouseleave", onMouseLeave)

    // Animate loop
    let raf = 0
    let running = true
    let lastFrame = performance.now()
    let elapsed = 0
    const animate = () => {
      if (!running) return
      raf = requestAnimationFrame(animate)
      const now = performance.now()
      const dt = Math.min((now - lastFrame) / 1000, 0.05)
      lastFrame = now
      elapsed += dt
      const t = elapsed
      orbitGroups.forEach((g) => {
        g.rotation.y += dt * ((g.userData as { speed: number }).speed ?? 0.05)
      })

      const nucleus = allNodes["praxis"]
      if (nucleus) {
        nucleus.mesh.scale.setScalar(Math.sin(t * 1.4) * 0.05 + 1)
        const target = 1.4 * (1 + 0.12 * Math.sin(t * 1.4))
        const meshMat = nucleus.mesh.material as THREE.MeshStandardMaterial
        const cur = meshMat.emissiveIntensity
        meshMat.emissiveIntensity = cur + (target - cur) * 0.08
      }

      allMeshes.forEach((mesh) => {
        const u = mesh.userData as {
          node?: AtomNode
          baseEmissive?: number
          pulseAmp?: number
          pulseFreq?: number
          pulsePhase?: number
        }
        if (!u || typeof u.baseEmissive !== "number") return
        if (u.node && u.node.kind === "mark") return
        const pulse =
          Math.sin(t * (u.pulseFreq ?? 0) + (u.pulsePhase ?? 0)) * (u.pulseAmp ?? 0) + 1
        ;(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = u.baseEmissive * pulse
      })

      updateEdges()
      controls.update()
      composer.render()
    }
    animate()

    // Resize
    const onResize = () => {
      const w = stage.clientWidth
      const h = stage.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
      bloom.resolution = new THREE.Vector2(w, h)
    }
    window.addEventListener("resize", onResize)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      canvas.removeEventListener("mousemove", onMouseMove)
      canvas.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("resize", onResize)
      disposables.forEach((d) => {
        try {
          d.dispose()
        } catch {
          // ignore disposal errors during teardown
        }
      })
    }
  }, [])

  return (
    <div className="atom-stage" id="atom-stage" ref={stageRef}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <span className="stage-tl">FIG. 01</span>
      <span className="stage-tr">PRAXIS · OPERATING ATOM</span>
      <span className="stage-bl">SCALE · 1:1 LOGICAL</span>
      <span className="stage-br">2026 · MMXXVI</span>
      <canvas id="atom-canvas" ref={canvasRef} />
      <div className="hud-tr">
        <div>
          <span className="v gold">26</span> entities · <span className="v">06</span> orbits
        </div>
        <div>
          <span className="v">156</span> tables · <span className="v">12</span> modules
        </div>
        <div>
          <span className="v red">99.94%</span> uptime · 30d
        </div>
      </div>
      <div className="controls-hint">
        <div>
          <span className="key">DRAG</span> rotate
        </div>
        <div>
          <span className="key">SCROLL</span> zoom
        </div>
        <div>
          <span className="key">HOVER</span> inspect
        </div>
      </div>
      {hovered && (
        <div
          className="atom-tooltip in"
          style={{ left: hovered.x, top: hovered.y }}
        >
          <div className="tt-cat">{hovered.cat}</div>
          <div className="tt-name">{hovered.name}</div>
          <div className="tt-desc">{hovered.desc}</div>
          <div className="tt-meta">
            <span className="gold">·</span> {hovered.meta}
          </div>
        </div>
      )}
    </div>
  )
}
