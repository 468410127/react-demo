function loadModules(requireContext, transformer = (mod) => mod.default) {
  return requireContext.keys().map((key) => transformer(requireContext(key)));
}

export default loadModules;
