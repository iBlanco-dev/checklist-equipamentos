-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Tempo de geração: 29-Out-2026 às 11:47
-- Versão do servidor: 10.6.22-MariaDB-0ubuntu0.22.04.1
-- versão do PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `checklist`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `itens`
--

CREATE TABLE `itens` (
  `id` int(10) UNSIGNED NOT NULL,
  `nome` varchar(150) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Extraindo dados da tabela `itens`
--

INSERT INTO `itens` (`id`, `nome`, `image`, `status`, `created_at`) VALUES
(1, 'Câmera Sony', NULL, 'ativo', '2026-09-16 15:10:13'),
(2, 'Tripé', NULL, 'inativo', '2026-10-26 10:05:25'),
(3, 'Câmera 80D', NULL, 'ativo', '2026-10-26 10:42:10'),
(4, 'Osmo', NULL, 'ativo', '2026-10-26 10:42:45'),
(5, 'Drone Dji Mini 2 ', NULL, 'ativo', '2026-10-26 10:43:10'),
(6, 'Lente Canon 50mm', NULL, 'ativo', '2026-10-26 10:44:28'),
(7, 'Lente Canon 18-55mm', NULL, 'ativo', '2026-10-26 10:44:43'),
(8, 'Filtros Kit para celular', NULL, 'ativo', '2026-10-26 10:45:23'),
(9, 'Bateria LED_NP- F970', NULL, 'ativo', '2026-10-26 10:50:47'),
(10, 'Bateria LED_NP- F970', NULL, 'ativo', '2026-10-26 10:50:59'),
(11, 'Bateria LED_NP- F970', NULL, 'ativo', '2026-10-26 10:51:01'),
(12, 'Bateria LED_NP- F970', NULL, 'ativo', '2026-10-26 10:51:02'),
(13, 'Bateria Canon LP-E6', NULL, 'ativo', '2026-10-26 11:01:32'),
(14, 'Bateria Canon LP-E6', NULL, 'ativo', '2026-10-26 11:01:38'),
(15, 'Carregador Bateria_Canon LP E6', NULL, 'ativo', '2026-10-26 11:02:33'),
(16, 'Carregador duplo LED_NP-F970', NULL, 'ativo', '2026-10-26 11:03:25'),
(17, 'Carregador  LED_NP-F970', NULL, 'ativo', '2026-10-26 11:04:08'),
(18, ' Lapela SYNC_Mic Câmera', NULL, 'ativo', '2026-10-26 11:09:19'),
(19, 'Hollyland Lark M2', NULL, 'ativo', '2026-10-26 11:10:06'),
(20, 'Hollyland Lark M2', NULL, 'ativo', '2026-10-26 11:10:17'),
(21, 'Bastão de LED Yongnuo', NULL, 'ativo', '2026-10-26 11:10:34'),
(22, 'Bastão de LED Yongnuo', NULL, 'ativo', '2026-10-26 11:10:40'),
(23, 'Painel de LED', NULL, 'ativo', '2026-10-26 11:10:53'),
(24, 'Painel de LED', NULL, 'ativo', '2026-10-26 11:10:59'),
(25, 'Fonte LED', NULL, 'ativo', '2026-10-26 11:11:31'),
(26, 'Fonte LED', NULL, 'ativo', '2026-10-26 11:11:33'),
(27, ' Rebatedor ', NULL, 'ativo', '2026-10-26 11:11:59'),
(28, 'Gimbal Osmo DJI Mobile 8', NULL, 'ativo', '2026-10-26 11:14:28'),
(29, 'Cage Estabilizadora Ulanzi', NULL, 'ativo', '2026-10-26 11:18:06'),
(30, 'Carregador portátil', NULL, 'ativo', '2026-10-26 11:18:22'),
(31, 'Teleprompter', NULL, 'ativo', '2026-10-26 11:19:09'),
(32, 'Tablet Samsung', NULL, 'ativo', '2026-10-26 11:19:37'),
(33, 'Softbox_Luz/Fonte', NULL, 'ativo', '2026-10-26 11:21:13'),
(34, 'Iphone 16 Pro Max', NULL, 'ativo', '2026-10-26 11:23:16'),
(35, 'Carregador Iphone', NULL, 'ativo', '2026-10-26 11:23:23'),
(36, 'Tripé Câmera', NULL, 'ativo', '2026-10-26 11:26:59'),
(37, 'Claquete', NULL, 'ativo', '2026-10-26 11:27:24'),
(38, 'Claquete', NULL, 'ativo', '2026-10-26 11:27:27'),
(39, 'Carregador LED_NP-F970', NULL, 'ativo', '2026-10-26 11:47:12'),
(40, 'Fonte Led', NULL, 'inativo', '2026-10-26 11:50:16'),
(41, 'Fonte Led', NULL, 'inativo', '2026-10-26 11:50:20'),
(42, 'Fita Crepe_Verde', NULL, 'ativo', '2026-10-26 11:52:45'),
(43, 'Fita Crepe_Laranja', NULL, 'ativo', '2026-10-26 11:52:54'),
(44, 'Régua_4  entradas', NULL, 'ativo', '2026-10-26 11:53:34'),
(45, 'Régua_5 entradas', NULL, 'ativo', '2026-10-26 11:53:51'),
(46, 'Régua_3 entradas', NULL, 'ativo', '2026-10-26 11:54:09'),
(47, 'Extensão', NULL, 'ativo', '2026-10-26 11:56:05'),
(48, 'Extensão', NULL, 'ativo', '2026-10-26 11:56:10'),
(49, 'Extensão', NULL, 'ativo', '2026-10-26 11:56:14'),
(50, 'Extensão 30M', NULL, 'ativo', '2026-10-26 11:56:54'),
(51, 'Cartão SD_64gb', NULL, 'ativo', '2026-10-26 12:02:58'),
(52, 'Cartão SD_32gb', NULL, 'ativo', '2026-10-26 12:03:25'),
(53, 'Mala de mão_Preta', NULL, 'ativo', '2026-10-26 12:04:21'),
(54, 'Mochila Pac_Man', NULL, 'ativo', '2026-10-26 12:04:34'),
(55, 'Mochila Couro', NULL, 'ativo', '2026-10-26 12:04:38'),
(56, 'Tripé Softbox', NULL, 'ativo', '2026-10-26 12:07:19'),
(57, 'Tripé', NULL, 'ativo', '2026-10-26 12:07:23'),
(58, 'Tripé Greika_Antigo', NULL, 'ativo', '2026-10-26 12:09:22'),
(59, 'Lapela BOYA_Lightning', NULL, 'ativo', '2026-10-26 12:35:59'),
(60, 'Lapela BOYA_Tipo C', NULL, 'ativo', '2026-10-26 12:47:32'),
(61, 'Lapela KAIDI_Tipo C', NULL, 'ativo', '2026-10-26 12:47:55'),
(62, 'Fita Crepe_Amarela', NULL, 'ativo', '2026-10-27 18:04:07'),
(63, 'Fita Crepe_Rosa', NULL, 'ativo', '2026-10-27 18:04:14'),
(64, 'Cartão SD_128gb', NULL, 'ativo', '2026-10-27 18:10:52'),
(65, 'Bateria Sony', NULL, 'ativo', '2026-10-29 10:10:57'),
(66, 'Bateria Sony', NULL, 'ativo', '2026-10-29 10:11:01');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `itens`
--
ALTER TABLE `itens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_itens_status` (`status`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `itens`
--
ALTER TABLE `itens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
