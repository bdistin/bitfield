import ava from 'ava';
import { BitField, BitFieldObject } from '../src';

const enum TestBitsFlags {
	A = 'A',
	B = 'B',
	C = 'C'
}

type TestResolvable = TestBitsFlags | number | BitFieldObject | (TestBitsFlags | number | BitFieldObject)[]

/* eslint-disable no-bitwise, id-length */

class TestBits extends BitField<TestResolvable> {

	static FLAGS = {
		[TestBitsFlags.A]: 1 << 0,
		[TestBitsFlags.B]: 1 << 1,
		[TestBitsFlags.C]: 1 << 2
	} as const;

}

/* eslint-enable no-bitwise, id-length */

ava('equals', (test): void => {
	const testBits = new TestBits(1);

	test.true(testBits.equals(1));
});

ava('not equals', (test): void => {
	const testBits = new TestBits(1);

	test.false(testBits.equals(2));
});

ava('has', (test): void => {
	const testBits = new TestBits(1);

	test.true(testBits.has(1));
});

ava('has not', (test): void => {
	const testBits = new TestBits(1);

	test.false(testBits.has(2));
});

ava('has by string', (test): void => {
	const testBits = new TestBits(1);

	test.true(testBits.has(TestBitsFlags.A));
});

ava('has multiple', (test): void => {
	const testBits = new TestBits(3);

	test.true(testBits.has([TestBitsFlags.A, TestBitsFlags.B]));
});

ava('missing', (test): void => {
	const testBits = new TestBits(1);

	test.deepEqual(testBits.missing(TestBits.ALL), [TestBitsFlags.B, TestBitsFlags.C]);
});

ava('freeze', (test): void => {
	const testBits = new TestBits(1).freeze();

	test.throws(() => {
		testBits.bitfield = 2;
	}, { instanceOf: Error });
});

ava('add', (test): void => {
	const testBits = new TestBits(1);

	testBits.add(TestBitsFlags.B);

	test.is(testBits.bitfield, 3);
});

ava('frozen add', (test): void => {
	test.plan(2);

	const testBits = new TestBits(1).freeze();
	const otherBits = testBits.add(TestBitsFlags.B);

	test.is(testBits.bitfield, 1);
	test.is(otherBits.bitfield, 3);
});

ava('remove', (test): void => {
	const testBits = new TestBits(3);

	testBits.remove(TestBitsFlags.B);

	test.is(testBits.bitfield, 1);
});

ava('frozen remove', (test): void => {
	test.plan(2);

	const testBits = new TestBits(3).freeze();
	const otherBits = testBits.remove(TestBitsFlags.B);

	test.is(testBits.bitfield, 3);
	test.is(otherBits.bitfield, 1);
});

ava('serialize', (test): void => {
	const testBits = new TestBits(3);

	// eslint-disable-next-line id-length
	test.deepEqual(testBits.serialize(), { A: true, B: true, C: false });
});

ava('toArray', (test): void => {
	const testBits = new TestBits(3);

	test.deepEqual(testBits.toArray(), [TestBitsFlags.A, TestBitsFlags.B]);
});

ava('toJSON', (test): void => {
	const testBits = new TestBits(3);

	test.is(testBits.toJSON(), 3);
});

ava('valueOf', (test): void => {
	const testBits = new TestBits(3);

	test.is(testBits.valueOf(), 3);
});

ava('Symbol.iterator', (test): void => {
	const testBits = new TestBits(2);

	for (const value of testBits) test.is(value, TestBitsFlags.B);
});

ava('resolve', (test): void => {
	test.is(TestBits.resolve<TestResolvable>(), 0);
});

ava('resolve number', (test): void => {
	test.is(TestBits.resolve<TestResolvable>(1), 1);
});

ava('resolve string', (test): void => {
	test.is(TestBits.resolve<TestResolvable>(TestBitsFlags.B), 2);
});

ava('resolve bitfield', (test): void => {
	test.is(TestBits.resolve<TestResolvable>(new TestBits(TestBitsFlags.B)), 2);
});

ava('resolve array mixed', (test): void => {
	test.is(TestBits.resolve<TestResolvable>([1, TestBitsFlags.B, new TestBits(TestBitsFlags.C)]), 7);
});

ava('resolve bad input', (test): void => {
	test.throws(() => TestBits.resolve<TestResolvable>(null), { instanceOf: RangeError });
});
