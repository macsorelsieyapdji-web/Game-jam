function applyCorruption(objects, corruptionRate) {
  objects.forEach(obj => {
    if (Math.random() < corruptionRate) {
      obj.type = obj.type === "safe" ? "danger" : "safe";
    }
  });
}