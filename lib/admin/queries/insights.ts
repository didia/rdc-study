import 'server-only';

import type {createSupabaseServerClient} from '../db/server';
import {rangeBounds, trendGrain, type Dimension, type Range} from '../dashboard';

type Supabase = Awaited<ReturnType<typeof createSupabaseServerClient>>;

export async function getRevenue(supabase: Supabase, range: Range) {
  const {from, to} = rangeBounds(range);
  const [month, method, destination, pkg, outstanding, delivery] = await Promise.all([
    supabase.rpc('fn_revenue_by', {p_dimension: 'month', p_from: from, p_to: to}),
    supabase.rpc('fn_revenue_by', {p_dimension: 'method', p_from: from, p_to: to}),
    supabase.rpc('fn_revenue_by', {p_dimension: 'destination', p_from: from, p_to: to}),
    supabase.rpc('fn_revenue_by', {p_dimension: 'package', p_from: from, p_to: to}),
    supabase.rpc('fn_outstanding'),
    supabase.rpc('fn_delivery_stats', {p_from: from, p_to: to}),
  ]);
  return {
    month: month.data ?? [],
    method: method.data ?? [],
    destination: destination.data ?? [],
    package: pkg.data ?? [],
    outstanding: outstanding.data ?? [],
    delivery: delivery.data?.[0] ?? null,
  };
}

export async function getInsights(supabase: Supabase, range: Range, dimension: Dimension) {
  const {from, to} = rangeBounds(range);
  const [funnel, breakdown, speed, loss, trend] = await Promise.all([
    supabase.rpc('fn_funnel', {p_from: from, p_to: to}),
    supabase.rpc('fn_conversion_by', {p_dimension: dimension, p_from: from, p_to: to}),
    supabase.rpc('fn_speed', {p_from: from, p_to: to}),
    supabase.rpc('fn_loss_analysis', {p_from: from, p_to: to}),
    supabase.rpc('fn_trend', {p_from: from, p_to: to, p_grain: trendGrain(range)}),
  ]);
  return {
    funnel: funnel.data ?? [],
    breakdown: breakdown.data ?? [],
    speed: speed.data?.[0] ?? null,
    loss: loss.data ?? [],
    trend: trend.data ?? [],
    grain: trendGrain(range),
  };
}
