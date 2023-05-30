from pint import UnitRegistry, Quantity
from pint.quantity import _Quantity
from numpy import average, std
from sympy import Symbol, sympify, log

_Quantity._sympy_ = lambda s: sympify(f'{s.m}*{s.u:~}')

Ureg = UnitRegistry()
Ureg.default_format = "~P"

# T_P[P][n]表示以P为置信概率时, 自由度n对应的t_p值
T_P = {
    '0.68': [-1, -1, 1.32, 1.2, 1.14, 1.11, 1.09, 1.08, 1.07, 1.06],
    '0.90': [-1, -1, 2.92, 2.35, 2.13, 2.02, 1.94, 1.86, 1.83, 1.76],
    '0.95': [-1, -1, 4.30, 3.18, 2.78, 2.57, 2.46, 2.37, 2.31, 2.26],
    '0.99': [-1, -1, 9.93, 5.84, 4.60, 4.03, 3.71, 3.50, 3.36, 3.25]
}

# 分布类型: 0表示正态分布, 1表示均匀分布, 2表示三角分布
# k_P[P][n]表示以P为置信概率时, 分布类型n对应的t_p值
K_P = {
    '0.68': [1.000, 1.183, 1.064],
    '0.90': [1.650, 1.559, 1.675],
    '0.95': [1.960, 1.645, 1.901],
    '0.99': [2.580, 1.715, 2.204]
}
# C[n]表示分布类型n对应的置信系数C值
C = [3, 3**(1 / 2), 6**(1 / 2)]


class MeasureQty():
    is_angle = False

    def __init__(self, name, symbol, unit, delta, data: str, distribute=0, p_cfd='0.95'):
        self.name = name
        self.symbol = Symbol(symbol)
        self.unit = Ureg(unit)
        try:
            self.delta = float(delta) * self.unit
        except ValueError:
            self.delta = Ureg(delta)
        self.data_list = [float(i) for i in data.replace(',', ' ').split()]
        self.distribute = distribute
        self.p_cfd = p_cfd
        self.process()

    def process(self):
        self.len_data = len(self.data_list)
        self.float_ave = average(self.data_list)
        self.ave: Quantity = self.float_ave * self.unit

        self.sigma = std(self.data_list, ddof=1) * self.unit
        self.u_a = self.sigma / self.len_data**(1 / 2)
        self.t_p = T_P[self.p_cfd][self.len_data - 1]
        self.k_p = K_P[self.p_cfd][self.distribute]
        self.cfd = C[self.distribute]
        self.unc = ((self.t_p * self.u_a)**2 + (self.k_p * self.delta / self.cfd)**2)**(1 / 2)


class TargetQty():
    value = None

    def __init__(self, name, symbol, unit, expression):
        self.name = name
        self.symbol = Symbol(symbol)
        self.unit = Ureg(unit)
        self.expression = sympify(expression, rational=True, evaluate=False)

    def process(self, *measure_qty_list: MeasureQty):
        expr_subs = {mqty.symbol: mqty.ave for mqty in measure_qty_list}
        ave = Ureg(str(self.expression.evalf(subs=expr_subs))).to(self.unit)

        log_expr = log(self.expression)
        unc_r_square = 0
        for mqty in measure_qty_list:
            u_r = mqty.unc * Ureg(str(log_expr.diff(
                mqty.symbol).evalf(subs=expr_subs)))  # type: ignore
            unc_r_square += u_r**2
        self.value = ave.plus_minus(float(unc_r_square**(1 / 2)), relative=True)


if __name__ == '__main__':
    mqty1 = MeasureQty('摆长', 'l', 'cm', '0.2', '70.28,70.21 70.15')
    mqty2 = MeasureQty('总时间', 't', 's', '0.2', '83.97 84.03 83.97')
    print(mqty1.ave)
    print(mqty1.unc)
    tqty = TargetQty('重力加速度', 'g', 'm/s^2', '4*pi^2*l/(t/50)^2')
    tqty.process(mqty1, mqty2)
    print(tqty.value)

