'use client';

import { getModelMetrics, type ModelMetrics } from '@/lib/api';
import LatencyChart from '@/components/LatencyChart';
import { Brain, Zap, HardDrive, Target, Activity, CheckCircle, TrendingUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

function MetricCard({ label, value, icon, bg }: { label: string; value: string | number; icon: React.ReactNode; bg: string }) {
  return (
    <div className="card" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  );
}

function StageCard({ stage, label }: { stage: ModelMetrics['stage1']; label: string }) {
  const radialData = [
    { name: 'Accuracy',  value: stage.accuracy,  fill: '#3EB75A' },
    { name: 'Precision', value: stage.precision,  fill: '#FF8C00' },
    { name: 'Recall',    value: stage.recall,     fill: '#6d4c97' },
    { name: 'F1 Score',  value: stage.f1,         fill: '#e53935' },
  ];
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{label}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{stage.name}</div>
        </div>
        <span className="badge badge-green"><CheckCircle size={11} /> {stage.framework}</span>
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={180}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={14} data={radialData} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#f1f5f9' }} />
            <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [`${v}%`, '']} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ marginTop: 4 }}>
          {radialData.map(m => (
            <div key={m.name} className="metric-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.fill, display: 'inline-block' }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.name}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}%</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 14, background: '#f8fafc', borderRadius: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Avg Latency', value: `${stage.avgLatency}ms`, icon: <Zap     size={13} color="#FF8C00" /> },
            { label: 'Model Size',  value: stage.modelSize,          icon: <HardDrive size={13} color="#6d4c97" /> },
            { label: 'Input Size',  value: stage.inputSize,          icon: <Target   size={13} color="#3EB75A" /> },
            { label: 'Framework',   value: stage.framework,          icon: <Brain    size={13} color="#FF8C00" /> },
          ].map(d => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {d.icon}
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{d.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ModelPage() {
  // Model metrics always come from mock JSON (not in DB)
  const { stage1, stage2, classes, latencyHistory } = getModelMetrics();

  return (
    <div>
      <div className="page-header">
        <h1>AI Model Statistics</h1>
        <p>Performance metrics for the 2-stage MobileNetV2 TFLite inference pipeline.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', marginBottom: 20, background: 'rgba(62,183,90,0.08)', border: '1px solid rgba(62,183,90,0.2)', borderRadius: 10, fontSize: 13, color: '#2E8F45' }}>
        <span>📊</span>
        <span>Model metrics are sourced from evaluation results (not stored in the live database).</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        <MetricCard label="Stage 1 Accuracy"    value={`${stage1.accuracy}%`}                   icon={<Brain    size={18} color="#3EB75A" />} bg="rgba(62,183,90,0.12)"  />
        <MetricCard label="Stage 2 Accuracy"    value={`${stage2.accuracy}%`}                   icon={<Target   size={18} color="#6d4c97" />} bg="rgba(109,76,151,0.1)"  />
        <MetricCard label="Total Avg Latency"   value={`${stage1.avgLatency + stage2.avgLatency}ms`} icon={<Zap  size={18} color="#FF8C00" />} bg="rgba(255,140,0,0.12)"  />
        <MetricCard label="Pipeline Stages"     value="2-Stage"                                  icon={<Activity size={18} color="#e53935" />} bg="rgba(229,57,53,0.08)"  />
      </div>

      <div className="charts-grid charts-grid-equal" style={{ marginBottom: 20 }}>
        <StageCard stage={stage1} label="Stage 1 — Leaf Validator" />
        <StageCard stage={stage2} label="Stage 2 — Disease Classifier" />
      </div>

      <div className="charts-grid charts-grid-equal">
        <LatencyChart data={latencyHistory} />

        <div className="card">
          <div className="card-header">
            <div className="card-title">Per-Class Accuracy (Stage 2)</div>
            <span className="badge badge-purple"><TrendingUp size={11} /> {classes.length} classes</span>
          </div>
          <div className="card-body">
            {classes.map(cls => (
              <div key={cls.label} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cls.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{cls.accuracy}%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{
                    width: `${cls.accuracy}%`,
                    background: cls.label === 'Healthy' ? '#3EB75A' : cls.label === 'Early Blight' ? '#FF8C00' : cls.label === 'Late Blight' ? '#e53935' : '#6d4c97',
                  }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: 'linear-gradient(135deg,rgba(62,183,90,0.08),rgba(255,140,0,0.08))', border: '1px solid rgba(62,183,90,0.15)' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Pipeline Architecture</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Stage 1</strong> (LiteRob) validates potato leaf. Confirmed leaves pass to <strong style={{ color: 'var(--text-primary)' }}>Stage 2</strong> for 4-class disease classification.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
