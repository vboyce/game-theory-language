library(tidyverse)
library(jsonlite)
library(here)
library(rlang)

ParseJSONColumn <- function(x) {
  str_c("[ ", str_c(x, collapse = ",", sep = " "), " ]") %>%
    fromJSON(flatten = T)
}

## Data import constants


study_1_loc <- "data/study1_220107"
study_1_date_start <- lubridate::ymd("2022-01-07")

study_2_loc <- "data/study2_220413"
study_2_date_start <- lubridate::ymd("2022-04-13")

study_3_loc <- "data/study3_220627"
study_3_date_start <- lubridate::ymd("2022-06-24")

study_4_loc <- "data/study4_240520"
study_4_date_start <- lubridate::ymd("2024-05-20")

study_5_loc <- "data/study5_241028"
study_5_date_start <- lubridate::ymd("2024-10-26")

# expt 1
one_chat <- read_csv(here(study_1_loc, "raw_chat.csv")) %>%
  mutate(gametype = game_cond) |>
  mutate(cond = "normal") |>
  mutate(expt = str_c("1", "_", gametype)) |>
  select(expt, gameId, text, type, repNum, playerId, chat_cond, gametype, cond, targets)

one_rounds <- read_csv(here(study_1_loc, "raw_results.csv")) %>%
  mutate(gametype = game_cond) |>
  mutate(cond = "normal") |>
  mutate(expt = str_c("1", "_", gametype)) |>
  select(expt, gameId, repNum, playerId, payoff, response, time, box_A, box_B, AA, AB, BA, BB, chat_cond, gametype, cond, role)

# expt 2
two_chat <- read_csv(here(study_2_loc, "raw_chat.csv")) %>%
  mutate(cond = "normal") %>%
  mutate(expt = "2") |>
  select(expt, gameId, text, type, repNum, playerId, chat_cond, gametype, cond, targets)

two_rounds <- read_csv(here(study_2_loc, "raw_results.csv")) %>%
  mutate(cond = "normal") %>%
  mutate(expt = "2") |>
  select(expt, gameId, repNum, playerId, payoff, response, time, box_A, box_B, AA, AB, BA, BB, chat_cond, gametype, cond, role)

# expt 3
three_chat <- read_csv(here(study_3_loc, "raw_chat.csv")) %>%
  mutate(cond = case_when(
    gametype == "easyPD" ~ "easy",
    gametype == "hardPD" ~ "hard",
    gametype == "spikeBoS" ~ "spike",
    gametype == "BoS" ~ "normal"
  )) |>
  mutate(expt = "3") |>
  mutate(gametype = ifelse(str_detect(gametype, "PD"), "PD", "BoS")) |>
  select(expt, gameId, text, type, repNum, playerId, chat_cond, gametype, cond, targets)

three_rounds <- read_csv(here(study_3_loc, "raw_results.csv")) %>%
  mutate(cond = case_when(
    gametype == "easyPD" ~ "easy",
    gametype == "hardPD" ~ "hard",
    gametype == "spikeBoS" ~ "spike",
    gametype == "BoS" ~ "normal"
  )) |>
  mutate(expt = "3") |>
  mutate(gametype = ifelse(str_detect(gametype, "PD"), "PD", "BoS")) |>
  select(expt, gameId, repNum, playerId, payoff, response, time, box_A, box_B, AA, AB, BA, BB, chat_cond, gametype, cond, role)


# expt 4

four_chat <- read_csv(here(study_4_loc, "raw_chat.csv")) %>%
  mutate(cond = case_when(
    gametype == "BoS" ~ "normal",
    gametype == "easyPD" ~ "easy"
  )) |>
  mutate(expt = "4") |>
  mutate(gametype = ifelse(str_detect(gametype, "PD"), "PD", "BoS")) |>
  select(expt, gameId, text, type, repNum, playerId, chat_cond, gametype, cond, targets)

four_rounds <- read_csv(here(study_4_loc, "raw_results.csv")) %>%
  mutate(cond = case_when(
    gametype == "BoS" ~ "normal",
    gametype == "easyPD" ~ "easy"
  )) |>
  mutate(expt = "4") |>
  mutate(gametype = ifelse(str_detect(gametype, "PD"), "PD", "BoS")) |>
  select(expt, gameId, repNum, playerId, payoff, response, time, box_A, box_B, AA, AB, BA, BB, chat_cond, gametype, cond, role)

# expt 5
five_chat <- read_csv(here(study_5_loc, "raw_chat.csv")) %>%
  mutate(cond = case_when(
    gametype == "easyPD" ~ "easy",
    gametype == "hardPD" ~ "hard",
    gametype == "spikeBoS" ~ "spike",
    gametype == "BoS" ~ "normal"
  )) |>
  mutate(expt = "5", gametype = ifelse(str_detect(gametype, "PD"), "PD", "BoS")) |>
  select(expt, gameId, text, type, repNum, playerId, chat_cond, gametype, cond, targets)

five_rounds <- read_csv(here(study_5_loc, "raw_results.csv")) %>%
  mutate(cond = case_when(
    gametype == "easyPD" ~ "easy",
    gametype == "hardPD" ~ "hard",
    gametype == "spikeBoS" ~ "spike",
    gametype == "BoS" ~ "normal"
  )) |>
  mutate(expt = "5", gametype = ifelse(str_detect(gametype, "PD"), "PD", "BoS")) |>
  select(expt, gameId, repNum, playerId, payoff, response, time, box_A, box_B, AA, AB, BA, BB, chat_cond, gametype, cond, role)


# combine

all_chat <- one_chat |>
  bind_rows(two_chat) |>
  bind_rows(three_chat) |>
  bind_rows(four_chat) |>
  bind_rows(five_chat) |>
  filter(!is.na(gametype)) |>
  mutate(chat_cond = case_when(
    chat_cond == "chat" ~ "chat",
    chat_cond == "no_chat" ~ "nochat",
    chat_cond == "nochat" ~ "nochat"
  ))
all_rounds <- one_rounds |>
  bind_rows(two_rounds) |>
  bind_rows(three_rounds) |>
  bind_rows(four_rounds) |>
  bind_rows(five_rounds) |>
  mutate(chat_cond = case_when(
    chat_cond == "chat" ~ "chat",
    chat_cond == "no_chat" ~ "nochat",
    chat_cond == "nochat" ~ "nochat"
  ))
