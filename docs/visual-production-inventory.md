# Visual Production Inventory

Generated: 2026-09-11

## Summary

- Visual references scanned: 581
- Production visual assets specified: 45
- Visual-required references: 0
- Visual enrichment references: 521
- Unnecessary visual metadata references: 60
- Missing assets after production pass: 0

References without a stable visual ID are classified as unnecessary visual metadata when every flag is false, or enrichment metadata when the item uses map/visual context without an asset requirement. They do not block published questions.

| Subject | Total visual refs | Required | Enrichment | Unnecessary | Missing assets | Shared reusable assets |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| D1_ENVIRONMENT | 63 | 0 | 63 | 0 | 0 | none |
| D1_HEALTH_DISABILITIES | 24 | 0 | 24 | 0 | 0 | health_boarding_mobility_scene, health_cognitive_support_scene, health_urgent_help_decision_scene |
| D1_NAVIGATION | 50 | 0 | 50 | 0 | 0 | d1-nav-coverage-d1-nav-003-001-q001_simple_map_placeholder, d1-nav-coverage-d1-nav-003-004-q001_simple_map_placeholder, d1-nav-coverage-d1-nav-003-005-q001_simple_map_placeholder, d1-nav-coverage-d1-nav-003-007-q001_simple_map_placeholder, simple_distance_segments, simple_grid_center_route, simple_suburb_route |
| D1_SAFETY | 95 | 0 | 88 | 7 | 0 | safe_accident_scene_diagram, safe_child_restraint_scene, safe_children_road_scene, safe_pickup_dropoff_scene, safe_stopping_distance_visual, safe_wheelchair_stretcher_securement |
| D1_SERVICE | 39 | 0 | 39 | 0 | 0 | serv_communication_scene, serv_luggage_cleanliness_scene, serv_wheelchair_aid_scene |
| D1_VEHICLE_KNOWLEDGE | 143 | 0 | 120 | 23 | 0 | veh_battery_jump_start, veh_brake_system, veh_component_overview, veh_dashboard_warning_symbols, veh_defect_decision_tree, veh_fluid_reservoirs, veh_steering_system, veh_tread_depth_winter, veh_tyre_sidewall, veh_tyre_wear_patterns, veh_wheel_change_safety |
| D1_WORK_ENVIRONMENT_RISK | 23 | 0 | 13 | 10 | 0 | work_distraction_scene, work_driver_posture, work_environment_risk_map, work_impairment_decision, work_lifting_posture, work_night_shift_decision |
| D2_TRAFFIC_LAW | 144 | 0 | 124 | 20 | 0 | none |

## Deduplicated Visual Needs

- d1-nav-coverage-d1-nav-003-001-q001_simple_map_placeholder: Simple custom map metadata placeholder; the prompt contains all information needed to answer. (D1_NAVIGATION, P1, visual_enrichment)
- d1-nav-coverage-d1-nav-003-004-q001_simple_map_placeholder: Simple custom map metadata placeholder; the prompt contains all information needed to answer. (D1_NAVIGATION, P1, visual_enrichment)
- d1-nav-coverage-d1-nav-003-005-q001_simple_map_placeholder: Simple custom map metadata placeholder; the prompt contains all information needed to answer. (D1_NAVIGATION, P1, visual_enrichment)
- d1-nav-coverage-d1-nav-003-007-q001_simple_map_placeholder: Simple custom map metadata placeholder; the prompt contains all information needed to answer. (D1_NAVIGATION, P1, visual_enrichment)
- health_boarding_mobility_scene: Praktisk hjälp vid i- och urstigning när rörelse, balans eller ork påverkar resan. (D1_HEALTH_DISABILITIES, P2, visual_enrichment)
- health_cognitive_support_scene: Tydlig kommunikation och orienteringsstöd vid kognitiv eller neuropsykiatrisk påverkan. (D1_HEALTH_DISABILITIES, P2, visual_enrichment)
- health_urgent_help_decision_scene: Beslutsstöd för när resan ska avbrytas och hjälp tillkallas. (D1_HEALTH_DISABILITIES, P2, visual_enrichment)
- safe_accident_scene_diagram: Forsta atgarder vid olycksplats (D1_SAFETY, P1, visual_enrichment)
- safe_child_restraint_scene: Barnskydd och placering (D1_SAFETY, P1, visual_enrichment)
- safe_children_road_scene: Barn i trafikmiljo (D1_SAFETY, P1, visual_enrichment)
- safe_disability_access_scene: Passagerare med funktionsnedsattning i trafikmiljo (D1_SAFETY, P1, visual_enrichment)
- safe_load_luggage_scene: Last och lost bagage (D1_SAFETY, P1, visual_enrichment)
- safe_night_visibility_scene: Morker och synbarhet (D1_SAFETY, P1, visual_enrichment)
- safe_pickup_dropoff_scene: Saker pa- och avstigning (D1_SAFETY, P1, visual_enrichment)
- safe_roadside_stop_scene: Nodstopp pa motorvag eller 2+1-vag (D1_SAFETY, P1, visual_enrichment)
- safe_stopping_distance_visual: Hastighet, reaktion och stoppstracka (D1_SAFETY, P1, visual_enrichment)
- safe_weather_road_condition_scene: Regn, sno och halka (D1_SAFETY, P1, visual_enrichment)
- safe_wheelchair_stretcher_securement: Fastspanning av hjalpmedel (D1_SAFETY, P1, visual_enrichment)
- safe_zero_vision_diagram: Nollvisionens ansvar och mal (D1_SAFETY, P1, visual_enrichment)
- serv_communication_scene: Kommunikation utan antaganden (D1_SERVICE, P2, visual_enrichment)
- serv_entry_assistance_scene: Stöd vid in- och urstigning (D1_SERVICE, P2, visual_enrichment)
- serv_luggage_cleanliness_scene: Rent fordon och bagagehjälp (D1_SERVICE, P2, visual_enrichment)
- serv_wheelchair_aid_scene: Hjälpmedel och praktisk hantering (D1_SERVICE, P2, visual_enrichment)
- simple_distance_segments: Egen linjekarta med delsträckor 4 km, 6 km och 8 km. (D1_NAVIGATION, P1, visual_enrichment)
- simple_grid_center_route: Egen schematisk rutnätskarta med Start, Torg, Bro, Station och Sjukhus. (D1_NAVIGATION, P1, visual_enrichment)
- simple_suburb_route: Egen schematisk karta med huvudgata, sidogata, park och entré. (D1_NAVIGATION, P1, visual_enrichment)
- veh_battery_jump_start: Batteri och startkablar (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_brake_system: Bromssystem (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_component_overview: Fordonets uppbyggnad (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_dashboard_warning_symbols: Varningsindikeringar (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_defect_decision_tree: Felbedömning och åtgärd (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_drivetrain_types: Fram-, bak- och fyrhjulsdrift (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_fluid_reservoirs: Vätskor och läckage (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_fuse_panel: Säkringar (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_steering_system: Styrning och fel (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_tread_depth_winter: Mönsterdjup och vinterdäck (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_tyre_sidewall: Däckmärkning (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_tyre_wear_patterns: Däckslitage (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- veh_wheel_change_safety: Säkert hjulbyte (D1_VEHICLE_KNOWLEDGE, P1, visual_enrichment)
- work_distraction_scene: Visual metadata för utrustning och riskmedvetenhet under färd. (D1_WORK_ENVIRONMENT_RISK, P2, visual_enrichment)
- work_driver_posture: Visual metadata för körställning och variation. (D1_WORK_ENVIRONMENT_RISK, P2, visual_enrichment)
- work_environment_risk_map: Visual metadata för arbetsrisker i taxiarbetet. (D1_WORK_ENVIRONMENT_RISK, P2, visual_enrichment)
- work_impairment_decision: Visual metadata för påverkan och körförmåga. (D1_WORK_ENVIRONMENT_RISK, P2, visual_enrichment)
- work_lifting_posture: Visual metadata för belastning, lyft och hjälpmedel. (D1_WORK_ENVIRONMENT_RISK, P2, visual_enrichment)
- work_night_shift_decision: Visual metadata för trötthet, stress och arbetscykel. (D1_WORK_ENVIRONMENT_RISK, P2, visual_enrichment)
