library(tidyverse)
library(here)
library(brms)
library(rstan)
rstan_options(auto_write = TRUE)
options(mc.cores = parallel::detectCores())

source(here("manuscript/prep.R"))


all_rounds_for_mod <- all_rounds |> 
  mutate(is_chat_cond =ifelse(chat_cond=="chat", 1,0),
         is_bos = ifelse(gametype=="BoS", 1,0),
         expt=ifelse(expt %in% c("1_BoS", "1_PD"), "1", expt),
         combo_type=str_c(gametype, "_", cond) |> factor(levels=c("PD_easy", "PD_normal", "PD_hard", "BoS_normal", "BoS_spike"))
  )

# TODO need to think about this more
# trial order?

perf_priors <- c(
  set_prior("normal(5,2)", class = "Intercept"),
  set_prior("normal(0, 2)", class = "b"),
  set_prior("normal(0, 2)", class = "sd"))
 # set_prior("lkj(1)", class = "cor"))


payout_mega <- brm(payoff ~ is_chat_cond * is_bos + repNum+
                     (1|expt) +
                     (1|gameId),
                   prior=perf_priors,
                   control = list(adapt_delta = .95),
                   file=here("manuscript/model_files/raw", "payout_mega"),
                   data=all_rounds_for_mod)

payout_mega_combo <- brm(payoff ~ is_chat_cond * combo_type+ repNum+
                           (1|expt) +
                           (1|gameId),
                         prior=perf_priors,
                         control = list(adapt_delta = .95),
                         file=here("manuscript/model_files/raw", "payout_mega_combo"),
                         data=all_rounds_for_mod)

payout_3 <-  brm(payoff ~ is_chat_cond * combo_type +repNum+
                   (1|gameId)+
                   (1|playerId),
                 prior=perf_priors,
                 control = list(adapt_delta = .95),
                 file=here("manuscript/model_files/raw", "payout_combo_3"),
                 data=all_rounds_for_mod |> filter(expt=="3"))

payout_4 <-  brm(payoff ~ is_chat_cond * combo_type + repNum+
                   (1|gameId)+
                   (1|playerId),
                 prior=perf_priors,
                 control = list(adapt_delta = .95),
                 file=here("manuscript/model_files/raw", "payout_combo_4"),
                 data=all_rounds_for_mod |> filter(expt=="4"))

payout_5 <-  brm(payoff ~ is_chat_cond * combo_type + repNum+
                   (1|gameId)+
                   (1|playerId),
                 prior=perf_priors,
                 control = list(adapt_delta = .95),
                 file=here("manuscript/model_files/raw", "payout_combo_5"),
                 data=all_rounds_for_mod |> filter(expt=="5"))


outcome_mod_BoS <- all_rounds |> filter(gametype=="BoS") |> 
  select(expt, gameId, repNum, response, chat_cond, gametype, cond, role) |>
  pivot_wider(names_from = role, values_from = response) %>%
  mutate(outcome = str_c(p1, p2),
         aligned =ifelse(outcome %in% c("AA", "BB"), 1,0),
         is_chat_cond =ifelse(chat_cond=="chat", 1,0))

outcome_priors <- c(
  set_prior("normal(0, 1)", class = "b"),
  set_prior("normal(0, 1)", class = "sd")#,
  #set_prior("lkj(1)", class = "cor")
)

BoS_aligned_mega <- brm(aligned ~ is_chat_cond * cond + repNum+
                          (1|expt)+
                          (1| gameId), family=bernoulli(),
                        prior=outcome_priors,
                        control = list(adapt_delta = .95),
                        file=here("manuscript/model_files/raw", "BoS_aligned_mega"),
                        data=outcome_mod_BoS)

BoS_aligned_3 <- brm(aligned ~ is_chat_cond * cond + repNum+
                       (1| gameId), family=bernoulli(),
                     prior=outcome_priors,
                     control = list(adapt_delta = .95),
                     file=here("manuscript/model_files/raw", "BoS_aligned_3"),
                     data=outcome_mod_BoS |> filter(expt=="3"))

BoS_aligned_4 <- brm(aligned ~ is_chat_cond + repNum+
                       (1 | gameId), family=bernoulli(),
                     prior=outcome_priors,
                     control = list(adapt_delta = .95),
                     file=here("manuscript/model_files/raw", "BoS_aligned_4"),
                     data=outcome_mod_BoS |> filter(expt=="4"))

BoS_aligned_5 <- brm(aligned ~ is_chat_cond * cond + repNum+
                       (1| gameId), family=bernoulli(),
                     prior=outcome_priors,
                     control = list(adapt_delta = .95),
                     file=here("manuscript/model_files/raw", "BoS_aligned_5"),
                     data=outcome_mod_BoS |> filter(expt=="5"))


outcome_mod_PD <- all_rounds |> filter(gametype=="PD") |> 
  select(expt, gameId, repNum, response, chat_cond, gametype, cond, role) |>
  pivot_wider(names_from = role, values_from = response) %>%
  mutate(outcome = str_c(p1, p2),
         cooperate_fair=ifelse(outcome %in% c("AA"), 1,0),
         nash = ifelse(outcome %in% c( "BB"), 1,0),
         uneven = ifelse(outcome %in% c("AB", "BA"), 1,0),
         is_chat_cond=ifelse(chat_cond=="chat", 1,0))


PD_cooperate_mega <- brm(cooperate_fair ~ is_chat_cond * cond + repNum+
                           (1 |expt)+
                           (1| gameId),
                         family=bernoulli(),
                         prior=outcome_priors,
                         control = list(adapt_delta = .95),
                         file=here("manuscript/model_files/raw", "PD_cooperate_mega"),
                         data=outcome_mod_PD)

PD_cooperate_3 <- brm(cooperate_fair ~ is_chat_cond * cond +repNum+
                        (1| gameId),
                      family=bernoulli(),
                      prior=outcome_priors,
                      control = list(adapt_delta = .95),
                      file=here("manuscript/model_files/raw", "PD_cooperate_3"),
                      data=outcome_mod_PD |> filter(expt=="3"))

PD_cooperate_4 <- brm(cooperate_fair ~ is_chat_cond +repNum+
                        (1 | gameId), family=bernoulli(),
                      prior=outcome_priors,
                      control = list(adapt_delta = .95),
                      file=here("manuscript/model_files/raw", "PD_cooperate_4"),
                      data=outcome_mod_PD |> filter(expt=="4"))

PD_cooperate_5 <- brm(cooperate_fair ~ is_chat_cond * cond +repNum+
                        (1| gameId),family=bernoulli(),
                      prior=outcome_priors,
                      control = list(adapt_delta = .95),
                      file=here("manuscript/model_files/raw", "PD_cooperate_5"),
                      data=outcome_mod_PD |> filter(expt=="5"))


PD_uneven_mega <- brm(uneven ~ is_chat_cond * cond +repNum+
                        (1|expt)+
                        (1 | gameId), family=bernoulli(),
                      prior=outcome_priors,
                      control = list(adapt_delta = .95),
                      file=here("manuscript/model_files/raw", "PD_unneven_mega"),
                      data=outcome_mod_PD)

PD_uneven_3 <- brm(uneven ~ is_chat_cond * cond +repNum+
                     (1| gameId), family=bernoulli(),
                   prior=outcome_priors,
                   control = list(adapt_delta = .95),
                   file=here("manuscript/model_files/raw", "PD_unneven_3"),
                   data=outcome_mod_PD |> filter(expt=="3"))

PD_uneven_4 <- brm(uneven ~ is_chat_cond +repNum+
                     (1 | gameId), family=bernoulli(),
                   prior=outcome_priors,
                   control = list(adapt_delta = .95),
                   file=here("manuscript/model_files/raw", "PD_unneven_4"),
                   data=outcome_mod_PD |> filter(expt=="4"))

PD_uneven_5 <- brm(uneven~ is_chat_cond * cond +repNum+
                     (1| gameId), family=bernoulli(),
                   prior=outcome_priors,
                   control = list(adapt_delta = .95),
                   file=here("manuscript/model_files/raw", "PD_unneven_5"),
                   data=outcome_mod_PD |> filter(expt=="5"))

PD_nash_mega <- brm(nash ~ is_chat_cond * cond +repNum+
                      (1|expt)+
                      (1 | gameId), family=bernoulli(),
                    prior=outcome_priors,
                    control = list(adapt_delta = .95),
                    file=here("manuscript/model_files/raw", "PD_nash_mega"),
                    data=outcome_mod_PD)

PD_nash_3 <- brm(nash ~ is_chat_cond * cond +repNum+
                   (1| gameId), family=bernoulli(),
                 prior=outcome_priors,
                 control = list(adapt_delta = .95),
                 file=here("manuscript/model_files/raw", "PD_nash_3"),
                 data=outcome_mod_PD |> filter(expt=="3"))

PD_nash_4 <- brm(nash ~ is_chat_cond +repNum+
                   (1 | gameId), family=bernoulli(),
                 prior=outcome_priors,
                 control = list(adapt_delta = .95),
                 file=here("manuscript/model_files/raw", "PD_nash_4"),
                 data=outcome_mod_PD |> filter(expt=="4"))

PD_nash_5 <- brm(nash ~ is_chat_cond * cond +repNum+
                   (1| gameId), family=bernoulli(),
                 prior=outcome_priors,
                 control = list(adapt_delta = .95),
                 file=here("manuscript/model_files/raw", "PD_nash_5"),
                 data=outcome_mod_PD |> filter(expt=="5"))



library(tidybayes)

save_summary <- function(model) {
  intervals <- gather_draws(model, `b_.*`, regex = T) %>% mean_qi()
  
  stats <- gather_draws(model, `b_.*`, regex = T) %>%
    mutate(above_0 = ifelse(.value > 0, 1, 0)) %>%
    group_by(.variable) %>%
    summarize(pct_above_0 = mean(above_0)) %>%
    left_join(intervals, by = ".variable") %>%
    mutate(
      lower = .lower,
      upper = .upper,
      Term = str_sub(.variable, 3, -1),
      Estimate = .value
    ) %>%
    select(Term, Estimate, lower, upper)
  
  stats
}


form <- function(model) {
  dep <- as.character(model$formula[2])
  ind <- as.character(model$formula[3])
  
  str_c(dep, " ~ ", ind) %>%
    str_replace_all(" ", "") %>%
    str_replace_all("\\*", " $\\\\times$ ") %>%
    str_replace_all("\\+", "&nbsp;+ ") %>%
    str_replace_all("~", "$\\\\sim$ ")
}

do_model <- function(path) {
  model <- read_rds(here(model_location, "raw", path))
  save_summary(model) |> write_rds(here(model_location, "summary", path))
  model$formula |> write_rds(here(model_location, "formulae", path))
  print(summary(model))
}

model_location="manuscript/model_files"
mods <- list.files(path = here("manuscript/model_files/raw"), pattern = ".*rds") |> walk(~ do_model(.))

