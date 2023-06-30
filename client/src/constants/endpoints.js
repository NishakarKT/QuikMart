const BASE = "http://localhost:8000";
// const BASE = "https://quikmartt.onrender.com";
// auth endpoints
export const AUTH_IN_ENDPOINT = BASE + "/auth/in";
export const AUTH_TOKEN_ENDPOINT = BASE + "/auth/token";
export const AUTH_OTP_GENERATE_ENDPOINT = BASE + "/auth/otp-generate";
export const AUTH_OTP_VERIFY_ENDPOINT = BASE + "/auth/otp-verify";
// user endpoints
export const USER_ENDPOINT = BASE + "/user";
// analytics endpoints
export const ANALYTICS_NEW_ENDPOINT = BASE + "/analytics/new";
export const ANALYTICS_GET_ENDPOINT = BASE + "/analytics/get";
// admin endpoints
export const ADMIN_GET_COLLECTIONS_ENDPOINT = BASE + "/admin/get-collections";
export const ADMIN_GET_DOCUMENTS_ENDPOINT = BASE + "/admin/get-documents";
export const ADMIN_REMOVE_DOCUMENTS_ENDPOINT = BASE + "/admin/remove-documents";
export const ADMIN_NEW_DOCUMENT_ENDPOINT = BASE + "/admin/new-document";
export const ADMIN_EDIT_DOCUMENT_ENDPOINT = BASE + "/admin/edit-document";
// product endpoints
export const PRODUCT_REMOVE_PRODUCTS_ENDPOINT = BASE + "/product/remove-products";
export const PRODUCTS_GET_WISHLIST_ENDPOINT = BASE + "/product/get-wishlist";
export const PRODUCTS_GET_CART_ENDPOINT = BASE + "/product/get-cart";
export const PRODUCT_EDIT_PRODUCT_ENDPOINT = BASE + "/product/edit-product";
export const PRODUCT_NEW_PRODUCT_ENDPOINT = BASE + "/product/new-product";
export const PRODUCT_NEW_PRODUCTS_ENDPOINT = BASE + "/product/new-products";
export const PRODUCTS_GET_FEATURED_PRODUCTS_ENDPOINT = BASE + "/product/get-featured-products";
export const PRODUCT_GET_PRODUCTS_BY_QUERY_ENDPOINT = BASE + "/product/get-products-by-query";
export const PRODUCT_GET_PRODUCTS_COUNT_BY_QUERY_ENDPOINT = BASE + "/product/get-products-count-by-query";
export const PRODUCT_GET_PRODUCTS_BY_LOCATION_ENDPOINT = BASE + "/product/get-products-by-location";
export const PRODUCT_ADD_TO_CART_ENDPOINT = BASE + "/product/add-to-cart";
export const PRODUCT_ADD_TO_WISHLIST_ENDPOINT = BASE + "/product/add-to-wishlist";
export const PRODUCT_REMOVE_FROM_CART_ENDPOINT = BASE + "/product/remove-from-cart";
export const PRODUCT_REMOVE_FROM_WISHLIST_ENDPOINT = BASE + "/product/remove-from-wishlist";
export const PRODUCT_EMPTY_WISHLIST_ENDPOINT = BASE + "/product/empty-wishlist";
export const PRODUCT_EMPTY_CART_ENDPOINT = BASE + "/product/empty-cart";
export const PRODUCT_WISHLIST_TO_CART_ENDPOINT = BASE + "/product/wishlist-to-cart";
export const PRODUCT_CART_TO_WISHLIST_ENDPOINT = BASE + "/product/cart-to-wishlist";
export const PRODUCT_NEW_ORDER_ENDPOINT = BASE + "/product/new-order";
export const PRODUCT_NEW_ORDERS_ENDPOINT = BASE + "/product/new-orders";
export const PRODUCT_GET_ORDERS_ENDPOINT = BASE + "/product/get-orders";
export const PRODUCT_REMOVE_ORDERS_ENDPOINT = BASE + "/product/remove-orders";
export const PRODUCT_CANCEL_ORDERS_ENDPOINT = BASE + "/product/cancel-orders";
export const PRODUCT_ACCEPT_ORDERS_ENDPOINT = BASE + "/product/accept-orders";
export const PRODUCT_NEW_RATING_ENDPOINT = BASE + "/product/new-rating";
export const PRODUCT_NEW_REVIEW_ENDPOINT = BASE + "/product/new-review";
// file endpoints
export const FILE_NEW_FILE_ENDPOINT = BASE + "/file/new-file";
export const FILE_NEW_FILES_ENDPOINT = BASE + "/file/new-files";