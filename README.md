Module containing javascript enhacements for A3D platform.

### Dependencies
Until https://www.drupal.org/project/drupal/issues/3398525 gets merged, a javascript block with importmap is needed.
```
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/"
    }
  }
</script>
```
