const houseBodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.15, 0.2))
// houseBodyMesh.position.y
houseBodyMesh.updateMatrix()

const houseTopMesh = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.2, 4))
houseTopMesh.position.y = 0.15
houseTopMesh.rotation.y = Math.PI/4
houseTopMesh.updateMatrix()

const mergedHouseGeometry = new THREE.Geometry()
mergedHouseGeometry.merge(houseBodyMesh.geometry, houseBodyMesh.matrix)
mergedHouseGeometry.merge(houseTopMesh.geometry, houseTopMesh.matrix)

class House extends THREE.Mesh {
    constructor() {
        super(mergedHouseGeometry, data.houseMaterial)

        this.position.y += 0.1
    }
}