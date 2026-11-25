/**
 * DADOS DE TESTE (e2e V-19). Avaliações FICTÍCIAS, nunca publicadas: só entram no build quando
 * NOVERA_CONTENT_FIXTURE=avaliacoes. Incluem nota baixa para provar o mesmo tratamento.
 */
export const fixture = {
  reviews: [
    {
      id: "2027-01-10-01",
      productSlug: "planner-2027",
      rating: 5,
      comment: "Comentário de teste com nota cinco, usado só na suíte automatizada.",
      publicName: "Pessoa Teste A",
      submittedOn: "2027-01-10",
      publishedOn: "2027-01-12",
      verifiedPurchase: true,
    },
    {
      id: "2027-02-03-01",
      productSlug: "planner-2027",
      rating: 1,
      comment: "Comentário de teste com nota um, para conferir avaliações negativas.",
      publicName: "Pessoa Teste B",
      submittedOn: "2027-02-03",
      publishedOn: "2027-02-05",
      verifiedPurchase: true,
    },
    {
      id: "2027-01-20-01",
      productSlug: "planner-2027",
      rating: 4,
      comment: "Comentário de teste com nota quatro, usado só na suíte automatizada.",
      publicName: "Pessoa Teste C",
      submittedOn: "2027-01-20",
      publishedOn: "2027-01-22",
      verifiedPurchase: true,
    },
  ],
};
