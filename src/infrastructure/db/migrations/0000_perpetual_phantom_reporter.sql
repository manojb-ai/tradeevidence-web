CREATE TABLE "instruments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"instrument_type" text NOT NULL,
	"legal_name" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "instruments_instrument_type_check" CHECK ("instruments"."instrument_type" in ('COMMON_STOCK', 'DEPOSITARY_RECEIPT', 'REIT', 'ETF', 'MLP', 'REGISTERED_SHARE', 'CLOSED_END_FUND', 'TRACKING_STOCK')),
	CONSTRAINT "instruments_status_check" CHECK ("instruments"."status" in ('active', 'inactive', 'delisted', 'acquired', 'unknown'))
);
--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "sectors_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "universe_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"universe_id" uuid NOT NULL,
	"version" text NOT NULL,
	"as_of" date NOT NULL,
	"selection_method" text NOT NULL,
	"eligibility_rules" jsonb NOT NULL,
	"exclusion_rules" jsonb NOT NULL,
	"requested_count" integer NOT NULL,
	"content_fingerprint" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "universe_versions_content_fingerprint_unique" UNIQUE("content_fingerprint"),
	CONSTRAINT "universe_versions_universe_id_version" UNIQUE("universe_id","version")
);
--> statement-breakpoint
CREATE TABLE "universes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text,
	CONSTRAINT "universes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "market_data_sources" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"description" text,
	CONSTRAINT "market_data_sources_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "market_data_versions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"market_data_source_id" uuid NOT NULL,
	"version_label" text NOT NULL,
	"imported_at" timestamp with time zone NOT NULL,
	"content_fingerprint" text NOT NULL,
	CONSTRAINT "market_data_versions_content_fingerprint_unique" UNIQUE("content_fingerprint"),
	CONSTRAINT "market_data_versions_source_id_version_label" UNIQUE("market_data_source_id","version_label")
);
--> statement-breakpoint
CREATE TABLE "market_observations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"instrument_id" uuid NOT NULL,
	"market_data_version_id" uuid NOT NULL,
	"observation_type" text NOT NULL,
	"trading_session" text NOT NULL,
	"bar_interval" text NOT NULL,
	"observation_point" text NOT NULL,
	"market_date" date NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"exchange_timezone" text NOT NULL,
	"open" numeric NOT NULL,
	"high" numeric NOT NULL,
	"low" numeric NOT NULL,
	"close" numeric NOT NULL,
	"volume" numeric NOT NULL,
	"canonical_price" numeric NOT NULL,
	"adjustment_policy" text NOT NULL,
	"corporate_action_version" text,
	CONSTRAINT "market_observations_identity" UNIQUE("instrument_id","observation_type","trading_session","bar_interval","observation_point","observed_at","market_data_version_id"),
	CONSTRAINT "market_observations_observation_type_check" CHECK ("market_observations"."observation_type" in ('eod', 'intraday', 'realtime')),
	CONSTRAINT "market_observations_trading_session_check" CHECK ("market_observations"."trading_session" in ('regular', 'premarket', 'afterhours')),
	CONSTRAINT "market_observations_nonnegative_check" CHECK ("market_observations"."open" >= 0 and "market_observations"."high" >= 0 and "market_observations"."low" >= 0 and "market_observations"."close" >= 0 and "market_observations"."volume" >= 0 and "market_observations"."canonical_price" >= 0),
	CONSTRAINT "market_observations_ohlc_consistency_check" CHECK ("market_observations"."high" >= "market_observations"."open" and "market_observations"."high" >= "market_observations"."close" and "market_observations"."high" >= "market_observations"."low" and "market_observations"."low" <= "market_observations"."open" and "market_observations"."low" <= "market_observations"."close")
);
--> statement-breakpoint
CREATE TABLE "analysis_runs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"universe_version_id" uuid NOT NULL,
	"snapshot_type" text NOT NULL,
	"market_data_as_of" timestamp with time zone NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"staged_at" timestamp with time zone,
	"validated_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"published_at" timestamp with time zone,
	"superseded_at" timestamp with time zone,
	"superseded_by_run_id" uuid,
	"engine_version" text NOT NULL,
	"ruleset_version" text NOT NULL,
	"decision_confidence_model_version" text NOT NULL,
	"selection_model_version" text NOT NULL,
	"strategy_alignment_version" text NOT NULL,
	"payload_schema_version" text NOT NULL,
	"bundle_checksum" text NOT NULL,
	"analytical_fingerprint" text NOT NULL,
	"equivalent_run_id" uuid,
	"failure_stage" text,
	"failure_category" text,
	CONSTRAINT "analysis_runs_status_check" CHECK ("analysis_runs"."status" in ('generated', 'staged', 'validated', 'approved', 'published', 'superseded', 'rejected', 'redundant'))
);
--> statement-breakpoint
CREATE TABLE "publication_pointers" (
	"channel" text PRIMARY KEY NOT NULL,
	"current_analysis_run_id" uuid NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"updated_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_factor_results" (
	"id" uuid PRIMARY KEY NOT NULL,
	"symbol_snapshot_id" uuid NOT NULL,
	"factor_code" text NOT NULL,
	"factor_definition_version" text NOT NULL,
	"observed_state" text NOT NULL,
	"effect" text NOT NULL,
	"contribution" numeric,
	"explanation_code" text NOT NULL,
	"template_version" text NOT NULL,
	"parameters" jsonb NOT NULL,
	"rendered_text" text NOT NULL,
	"display_order" integer NOT NULL,
	CONSTRAINT "evidence_factor_results_snapshot_factor_code" UNIQUE("symbol_snapshot_id","factor_code"),
	CONSTRAINT "evidence_factor_results_effect_check" CHECK ("evidence_factor_results"."effect" in ('supporting', 'contradicting', 'neutral', 'unavailable', 'not_evaluated'))
);
--> statement-breakpoint
CREATE TABLE "market_context_snapshots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"analysis_run_id" uuid NOT NULL,
	"regime" text NOT NULL,
	"risk_environment" text NOT NULL,
	"freshness_status" text NOT NULL,
	"supporting_summary" text NOT NULL,
	"contradicting_summary" text,
	"observation_refs" jsonb NOT NULL,
	"rendered_explanation" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sector_context_snapshots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"analysis_run_id" uuid NOT NULL,
	"sector_id" uuid NOT NULL,
	"representative_benchmark_instrument_id" uuid NOT NULL,
	"trend" text NOT NULL,
	"momentum" text NOT NULL,
	"relative_strength" numeric,
	"evidence_state" text NOT NULL,
	"freshness_status" text NOT NULL,
	"observation_refs" jsonb NOT NULL,
	"factors" jsonb NOT NULL,
	"rendered_explanation" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "sector_context_snapshots_run_sector" UNIQUE("analysis_run_id","sector_id")
);
--> statement-breakpoint
CREATE TABLE "symbol_evidence_snapshots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"analysis_run_id" uuid NOT NULL,
	"instrument_id" uuid NOT NULL,
	"symbol_at_publication" text NOT NULL,
	"market_observation_id" uuid NOT NULL,
	"market_context_snapshot_id" uuid NOT NULL,
	"sector_context_snapshot_id" uuid,
	"snapshot_type" text NOT NULL,
	"session" text NOT NULL,
	"bar_interval" text NOT NULL,
	"market_data_as_of" timestamp with time zone NOT NULL,
	"canonical_price" numeric NOT NULL,
	"technical_evidence_score" numeric(5, 2),
	"evidence_band" text,
	"evidence_status" text NOT NULL,
	"coverage_percent" numeric(5, 2) NOT NULL,
	"freshness_status" text NOT NULL,
	CONSTRAINT "symbol_evidence_snapshots_run_instrument_type" UNIQUE("analysis_run_id","instrument_id","snapshot_type"),
	CONSTRAINT "symbol_evidence_snapshots_status_check" CHECK ("symbol_evidence_snapshots"."evidence_status" in ('complete', 'incomplete')),
	CONSTRAINT "symbol_evidence_snapshots_freshness_check" CHECK ("symbol_evidence_snapshots"."freshness_status" in ('current', 'stale', 'superseded')),
	CONSTRAINT "symbol_evidence_snapshots_score_range_check" CHECK ("symbol_evidence_snapshots"."technical_evidence_score" is null or ("symbol_evidence_snapshots"."technical_evidence_score" >= 0 and "symbol_evidence_snapshots"."technical_evidence_score" <= 100)),
	CONSTRAINT "symbol_evidence_snapshots_coverage_range_check" CHECK ("symbol_evidence_snapshots"."coverage_percent" >= 0 and "symbol_evidence_snapshots"."coverage_percent" <= 100),
	CONSTRAINT "symbol_evidence_snapshots_incomplete_has_no_score_check" CHECK ("symbol_evidence_snapshots"."evidence_status" <> 'incomplete' or "symbol_evidence_snapshots"."technical_evidence_score" is null)
);
--> statement-breakpoint
ALTER TABLE "universe_versions" ADD CONSTRAINT "universe_versions_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_data_versions" ADD CONSTRAINT "market_data_versions_market_data_source_id_market_data_sources_id_fk" FOREIGN KEY ("market_data_source_id") REFERENCES "public"."market_data_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_observations" ADD CONSTRAINT "market_observations_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_observations" ADD CONSTRAINT "market_observations_market_data_version_id_market_data_versions_id_fk" FOREIGN KEY ("market_data_version_id") REFERENCES "public"."market_data_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_runs" ADD CONSTRAINT "analysis_runs_universe_version_id_universe_versions_id_fk" FOREIGN KEY ("universe_version_id") REFERENCES "public"."universe_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_runs" ADD CONSTRAINT "analysis_runs_superseded_by_run_id_analysis_runs_id_fk" FOREIGN KEY ("superseded_by_run_id") REFERENCES "public"."analysis_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analysis_runs" ADD CONSTRAINT "analysis_runs_equivalent_run_id_analysis_runs_id_fk" FOREIGN KEY ("equivalent_run_id") REFERENCES "public"."analysis_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_pointers" ADD CONSTRAINT "publication_pointers_current_analysis_run_id_analysis_runs_id_fk" FOREIGN KEY ("current_analysis_run_id") REFERENCES "public"."analysis_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_factor_results" ADD CONSTRAINT "evidence_factor_results_symbol_snapshot_id_symbol_evidence_snapshots_id_fk" FOREIGN KEY ("symbol_snapshot_id") REFERENCES "public"."symbol_evidence_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "market_context_snapshots" ADD CONSTRAINT "market_context_snapshots_analysis_run_id_analysis_runs_id_fk" FOREIGN KEY ("analysis_run_id") REFERENCES "public"."analysis_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sector_context_snapshots" ADD CONSTRAINT "sector_context_snapshots_analysis_run_id_analysis_runs_id_fk" FOREIGN KEY ("analysis_run_id") REFERENCES "public"."analysis_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sector_context_snapshots" ADD CONSTRAINT "sector_context_snapshots_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "public"."sectors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sector_context_snapshots" ADD CONSTRAINT "sector_context_snapshots_representative_benchmark_instrument_id_instruments_id_fk" FOREIGN KEY ("representative_benchmark_instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_evidence_snapshots" ADD CONSTRAINT "symbol_evidence_snapshots_analysis_run_id_analysis_runs_id_fk" FOREIGN KEY ("analysis_run_id") REFERENCES "public"."analysis_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_evidence_snapshots" ADD CONSTRAINT "symbol_evidence_snapshots_instrument_id_instruments_id_fk" FOREIGN KEY ("instrument_id") REFERENCES "public"."instruments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_evidence_snapshots" ADD CONSTRAINT "symbol_evidence_snapshots_market_observation_id_market_observations_id_fk" FOREIGN KEY ("market_observation_id") REFERENCES "public"."market_observations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_evidence_snapshots" ADD CONSTRAINT "symbol_evidence_snapshots_market_context_snapshot_id_market_context_snapshots_id_fk" FOREIGN KEY ("market_context_snapshot_id") REFERENCES "public"."market_context_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "symbol_evidence_snapshots" ADD CONSTRAINT "symbol_evidence_snapshots_sector_context_snapshot_id_sector_context_snapshots_id_fk" FOREIGN KEY ("sector_context_snapshot_id") REFERENCES "public"."sector_context_snapshots"("id") ON DELETE no action ON UPDATE no action;