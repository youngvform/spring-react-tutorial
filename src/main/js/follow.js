export function follow(api, rootPath, relArray) {
  const root = api({
    method: "GET",
    path: rootPath,
  });

  return relArray.reduce((total, item) => {
    const rel = typeof item === "string" ? item : item.rel;
    return traverseNext(total, rel, item);
  }, root);

  function hasEmbeddedRel(entity, rel) {
    return entity._embedded && entity._embedded.hasOwnProperty(rel);
  }

  function traverseNext(root, rel, arrayItem) {
    return root.then((res) => {
      if (hasEmbeddedRel(res.entity, rel)) {
        return res.entity._embedded[rel];
      }

      if (!res.entity._links) {
        return [];
      }

      if (typeof arrayItem === "string") {
        return api({
          method: 'GET',
          path: res.entity._links[rel].href
        });
      } else {
        return api({
          method: 'GET',
          path: res.entity._links[rel].href,
          params: arrayItem.params
        });
      }
    });
  }
}
