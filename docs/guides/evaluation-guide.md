# Evaluation Guide

## Metrics Tracked

1. **Retrieval Precision@k**: Measures what percentage of top-k retrieved chunks contain the ground-truth answer for test queries.
2. **Agent Reliability**: Measures the percentage of multi-step agent runs that complete all planned tools without fatal faults.
3. **Personalization Correctness**: Measures the percentage of impressions where delivered content matched visitor segment rules.

## Running Benchmarks

```bash
# Trigger evaluation via API
curl -X POST http://localhost:3001/api/eval/run \
  -H "Content-Type: application/json" \
  -d '{"evalType": "retrieval_precision", "sampleSize": 20}'
```
