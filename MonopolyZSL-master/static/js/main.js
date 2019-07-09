$(function() {
    main3d = new Main3D()
    ui = new Ui()
    net = new Net()

    $("#root").append(main3d.renderer.getDomElement())
    net.init()
})