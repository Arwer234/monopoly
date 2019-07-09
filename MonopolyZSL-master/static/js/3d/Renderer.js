class Renderer {
    constructor(params) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000)

        this.webGlRenderer = new THREE.WebGLRenderer({antialias: true})
        this.webGlRenderer.setClearColor(0x1C2126)
        this.webGlRenderer.setSize(500, 500)

        this.camera.position.set(10, 6, 10)
        this.camera.lookAt(0, 0, 0)

        this.webGlRenderer.render(this.scene, this.camera)

        var renderer = this

        window.onresize = function(ev) {
            var style = getComputedStyle(document.getElementById("root"))
            var w = parseInt(style.width)
            var h = parseInt(style.height)

            console.log(w,h)
    
            renderer.webGlRenderer.setSize(w, h)
            renderer.camera.aspect = w/h
            renderer.camera.updateProjectionMatrix()
        }
    
        window.onresize({target: window})

        params = params || {}

        if (params.axes) {
            var axes = new THREE.AxesHelper(1000)
            this.scene.add(axes)
        }

        if (params.orbit) {
            this.orbitControls = new THREE.OrbitControls(this.camera, this.webGlRenderer.domElement)
            this.orbitControls.addEventListener("change", function() {
                // renderer.webGlRenderer.render(main3d.renderer.scene, main3d.renderer.camera)
            })
        }

        this.renderCbs = []
        this.render()
    }

    render() {
        var renderer = this

        for (let i=0; i<this.renderCbs.length; i++)
            this.renderCbs[i]()
        
        requestAnimationFrame(function() {
            renderer.render()
        })

        this.webGlRenderer.render(this.scene, this.camera)
    }

    getDomElement() {
        return this.webGlRenderer.domElement
    }
}