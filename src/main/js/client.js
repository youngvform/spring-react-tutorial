import rest from "rest";
import deaultRequest from "rest/interceptor/defaultRequest";
import mime from "rest/interceptor/mime";
import uriTemplateInterceptor from "./api/uriTemplateInterceptor";
import errorCode from "rest/interceptor/errorCode";
import baseRegistry from "rest/mime/registry";

const registry = baseRegistry.child();

registry.register("text/uri-list", require("./api/uriListConverter"));
registry.register(
  "application/hal+json",
  require("rest/mime/type/application/hal")
);

export default rest
  .wrap(mime, { registry })
  .wrap(uriTemplateInterceptor)
  .wrap(errorCode)
  .wrap(deaultRequest, { header: { Accept: "application/hal+json" } });
