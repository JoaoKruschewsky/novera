/**
 * DADO DE TESTE (e2e V-04, V-05, V-21). Nunca usado em produção: só entra no build quando
 * NOVERA_CONTENT_FIXTURE=vendas-abertas (scripts/e2e-matrix.mjs). A URL é fictícia.
 */
export const fixture = {
  product: {
    sales: {
      state: "vendas-abertas",
      platform: "kiwify",
      checkoutUrl: "https://pay.kiwify.com.br/teste-e2e",
      price: null,
    },
  },
};
