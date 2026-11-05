-- Itens iguais deixam de ser cadastros repetidos: um cadastro com `quantidade`.
-- A comanda reserva N unidades (comanda_itens.quantidade) enquanto está aberta.
ALTER TABLE itens
  ADD COLUMN quantidade INT UNSIGNED NOT NULL DEFAULT 1 AFTER image;

ALTER TABLE comanda_itens
  ADD COLUMN quantidade INT UNSIGNED NOT NULL DEFAULT 1 AFTER id_item;

-- Unificação dos cadastros repetidos que existiam em produção (levantamento de 05/11/2026).
-- id_keep fica com a soma das unidades; id_dup vira inativo e o histórico das comandas aponta pro id_keep.
START TRANSACTION;

CREATE TABLE _merge_itens (
  id_dup INT UNSIGNED PRIMARY KEY,
  id_keep INT UNSIGNED NOT NULL
);

INSERT INTO _merge_itens (id_dup, id_keep) VALUES
  (22, 21), -- Bastão de LED Yongnuo
  (14, 13), -- Bateria Canon LP-E6
  (10, 9), (11, 9), (12, 9), -- Bateria LED_NP- F970
  (66, 65), -- Bateria Sony
  (39, 17), -- Carregador LED_NP-F970
  (38, 37), -- Claquete
  (48, 47), (49, 47), -- Extensão
  (26, 25), -- Fonte LED
  (20, 19), -- Hollyland Lark M2
  (24, 23); -- Painel de LED

-- Comandas que tinham o original e/ou cópias passam a ter uma linha só, com a soma
INSERT INTO comanda_itens (id_comanda, id_item, quantidade, created_at)
SELECT ci.id_comanda, COALESCE(m.id_keep, ci.id_item), SUM(ci.quantidade), MIN(ci.created_at)
FROM comanda_itens ci
LEFT JOIN _merge_itens m ON m.id_dup = ci.id_item
WHERE ci.id_item IN (SELECT id_dup FROM _merge_itens UNION SELECT id_keep FROM _merge_itens)
GROUP BY ci.id_comanda, COALESCE(m.id_keep, ci.id_item)
ON DUPLICATE KEY UPDATE quantidade = VALUES(quantidade);

DELETE FROM comanda_itens WHERE id_item IN (SELECT id_dup FROM _merge_itens);

UPDATE itens i
JOIN (SELECT id_keep, COUNT(*) + 1 AS total FROM _merge_itens GROUP BY id_keep) g ON g.id_keep = i.id
SET i.quantidade = g.total,
    i.nome = TRIM(REPLACE(i.nome, '  ', ' '));

UPDATE itens SET status = 'inativo' WHERE id IN (SELECT id_dup FROM _merge_itens);

-- Espaços sobrando no início/fim atrapalham ordenação e busca (ex.: ' Lapela SYNC_Mic Câmera')
UPDATE itens SET nome = TRIM(nome) WHERE nome <> TRIM(nome);

DROP TABLE _merge_itens;

COMMIT;
